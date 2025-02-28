import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import {
	PieChart as MuiPieChart,
	pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import { NoData } from '@ea11y/components/analytics/components/no-data';
import { PieTooltip } from '@ea11y/components/analytics/components/pie-tooltip';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FEATURE_MAPPER, CHARTS_COLORS } from '../../../constants';
import { useAnalyticsContext } from '../../../contexts/analytics-context';

export const PieChart = () => {
	const { stats } = useAnalyticsContext();
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
	const topItems = sortedArray.slice(0, 4); // Top 3 items
	const otherItems = sortedArray.slice(4); // Items ranked 4 and below

	const otherTotal = otherItems.reduce(
		(sum, item) => sum + Number(item.total),
		0,
	);
	if (otherTotal > 0) {
		topItems.push({ event: 'other', total: otherTotal });
	}

	const totalSum = topItems.reduce((sum, item) => sum + Number(item.total), 0);
	const formatted = topItems.map((item, index) => {
		const percent = parseFloat(((item.total / totalSum) * 100).toFixed(2));
		return {
			label: `${FEATURE_MAPPER[item.event].chartsTitle}: ${Math.round(percent)}%`,
			featureTitle: FEATURE_MAPPER[item.event].chartsTitle,
			featureClicks: item.total,
			color: CHARTS_COLORS[index],
			value: percent, // Format to 2 decimal places
		};
	});

	const showChart = stats.elements.length > 0 && chartWidth !== null;

	return (
		<Card variant="outlined" sx={{ height: '100%' }} ref={containerRef}>
			<CardHeader
				title={
					<Box display="flex" gap={1}>
						<Typography variant="subtitle1">
							{__('Feature usage', 'pojo-accessibility')}
						</Typography>
						<Infotip
							content={
								<Typography variant="body1" sx={{ p: 2, maxWidth: '300px' }}>
									{__(
										"Track which accessibility features visitors use most from your widget so you can better understand your audience's needs.",
										'pojo-accessibility',
									)}
								</Typography>
							}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					</Box>
				}
				sx={{ pb: 0 }}
			/>
			{showChart && (
				<MuiPieChart
					series={[
						{
							data: formatted,
							innerRadius: chartWidth < 100 ? chartWidth - 20 : 80,
							outerRadius: chartWidth < 100 ? chartWidth : 100,
							paddingAngle: 0,
							cornerRadius: 0,
							startAngle: 0,
							endAngle: 360,
							cx: chartWidth + 48,
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
			)}
			{stats.elements.length === 0 && <NoData />}
		</Card>
	);
};
