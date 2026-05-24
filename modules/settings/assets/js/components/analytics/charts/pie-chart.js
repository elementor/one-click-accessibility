import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import RtlProvider from '@mui/system/RtlProvider';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import {
	PieChart as MuiPieChart,
	pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import { NoData } from '@ea11y/components/analytics/components/no-data';
import { PieChartTitle } from '@ea11y/components/analytics/components/pie-chart-title';
import { PieTooltip } from '@ea11y/components/analytics/components/pie-tooltip';
import { useEffect, useRef, useState } from '@wordpress/element';
import { FEATURE_MAPPER, CHARTS_COLORS } from '../../../constants';
import { useAnalyticsContext } from '../../../contexts/analytics-context';
import { usePluginSettingsContext } from '../../../contexts/plugin-settings';

const ConditionalRtl = ({ enabled, children }) =>
	enabled ? <RtlProvider value>{children}</RtlProvider> : children;

export const PieChart = () => {
	const { stats } = useAnalyticsContext();
	const { isRTL = false } = usePluginSettingsContext();
	const containerRef = useRef(null);
	const [chartWidth, setChartWidth] = useState(null);

	const onResize = () =>
		setChartWidth(Number(containerRef.current.offsetWidth) / 4 - 32);

	useEffect(() => {
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	useEffect(() => {
		onResize();
	}, [containerRef]);

	// Step 1: Combine totals for the same event
	const combined = stats.elements?.reduce((acc, { event, total }) => {
		acc[event] = (acc[event] || 0) + Number(total);
		return acc;
	}, {});

	const sortedArray = Object.entries(combined)
		.map(([event, total]) => ({ event, total }))
		.sort((a, b) => b.value - a.value);

	const showTotalTopItems = 6;
	const topItems = sortedArray.slice(0, showTotalTopItems);
	const otherItems = sortedArray.slice(showTotalTopItems);

	const otherTotal = otherItems.reduce(
		(sum, item) => sum + Number(item.total),
		0,
	);
	if (otherTotal > 0) {
		topItems.push({ event: 'other', total: otherTotal });
	}

	const totalSum = topItems.reduce((sum, item) => sum + Number(item.total), 0);

	// cx is measured inside the drawing area (drawingWidth = container - margin.left - margin.right).
	// LTR margins: { left: 5, right: 100 }; RTL margins: { left: 100, right: 5 }. Both sum to 105.
	// Mirror cx against drawingWidth in RTL to place the pie on the visual right.
	const containerWidth = containerRef.current?.offsetWidth ?? 0;
	const drawingWidth = Math.max(containerWidth - 105, 0);
	const pieCenterX =
		isRTL && drawingWidth > 0
			? drawingWidth - (chartWidth + 48)
			: chartWidth + 48;

	const formatted = topItems.map((item, index) => {
		const percent = parseFloat(((item.total / totalSum) * 100).toFixed(2));
		return {
			label: `${FEATURE_MAPPER[item.event].chartsTitle}: ${percent}%`,
			featureTitle: FEATURE_MAPPER[item.event].chartsTitle,
			featureClicks: item.total,
			color: CHARTS_COLORS[index],
			value: percent, // Format to 2 decimal places
		};
	});

	const showChart = stats.elements.length > 0 && chartWidth !== null;

	return (
		<Card variant="outlined" sx={{ height: '100%' }} ref={containerRef}>
			<CardHeader title={<PieChartTitle />} sx={{ paddingBlockEnd: 0 }} />
			{showChart && (
				<ConditionalRtl enabled={isRTL}>
					<MuiPieChart
						series={[
							{
								data: formatted,
								innerRadius: chartWidth < 100 ? chartWidth - 15 : 85,
								outerRadius: chartWidth < 100 ? chartWidth : 100,
								paddingAngle: 0,
								cornerRadius: 0,
								startAngle: 0,
								endAngle: 360,
								cx: pieCenterX,
								cy: 150,
							},
						]}
						sx={{
							[`& .${pieArcLabelClasses.root}`]: {
								fontSize: '2.875rem',
								lineHeight: 1.43,
								letterSpacing: '0.01071em',
							},
							[`& .${legendClasses.mark}`]: {
								ry: 10,
							},
						}}
						slots={{
							itemContent: PieTooltip,
						}}
						slotProps={{
							legend: {
								itemMarkWidth: 10,
								itemMarkHeight: 10,
								markGap: 8,
								itemGap: 12,
								padding: 32,
								labelStyle: {
									fontWeight: 400,
									fontSize: '0.875rem',
									lineHeight: 1.43,
									letterSpacing: '0.01071em',
								},
							},
						}}
						height={300}
					/>
				</ConditionalRtl>
			)}
			{stats.elements.length === 0 && <NoData />}
		</Card>
	);
};
