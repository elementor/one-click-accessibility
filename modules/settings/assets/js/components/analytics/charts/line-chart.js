import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { useTheme } from '@elementor/ui/styles';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { LineChartTitle } from '@ea11y/components/analytics/components/line-chart-title';
import { LineTooltip } from '@ea11y/components/analytics/components/line-tooltip';
import { NoData } from '@ea11y/components/analytics/components/no-data';
import { dateI18n } from '@wordpress/date';
import { useAnalyticsContext } from '../../../contexts/analytics-context';

export const LineChart = () => {
	const theme = useTheme();
	const { stats } = useAnalyticsContext();
	const totalOpen = stats.dates.reduce(
		(sum, item) => sum + Number(item.total),
		0,
	);

	const showChart = stats.dates.length > 0;

	return (
		<Card variant="outlined" sx={{ height: '100%' }}>
			<CardHeader
				title={<LineChartTitle />}
				subheader={
					totalOpen > 0 ? (
						<Typography variant="h3" sx={{ height: '50px' }}>
							{totalOpen.toString()}
						</Typography>
					) : null
				}
				sx={{ pb: 0 }}
			/>
			{showChart && (
				<MuiLineChart
					series={[
						{
							type: 'line',
							curve: 'linear',
							data: stats.dates.map((item) => item.total),
							color: theme.palette.info.main,
						},
					]}
					xAxis={[
						{
							scaleType: 'point',
							data: stats.dates.map((item) => item.date),
							valueFormatter: (item, context) =>
								context.location === 'tick'
									? dateI18n('d.m', item, false)
									: item,
						},
					]}
					slots={{
						axisContent: LineTooltip,
					}}
					tooltip={{
						trigger: totalOpen ? 'axis' : 'none',
					}}
					height={250}
				/>
			)}
			{stats.dates.length === 0 && <NoData />}
		</Card>
	);
};
