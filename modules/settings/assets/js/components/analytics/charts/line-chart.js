import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import { useTheme } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { LineTooltip } from '@ea11y/components/analytics/components/line-tooltip';
import { NoData } from '@ea11y/components/analytics/components/no-data';
import { dateI18n } from '@wordpress/date';
import { __ } from '@wordpress/i18n';
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
				title={
					<Box display="flex" gap={1}>
						<Typography variant="subtitle1">
							{__('Widget activations', 'pojo-accessibility')}
						</Typography>
						<Infotip
							content={
								<Typography variant="body1" sx={{ p: 2, maxWidth: '300px' }}>
									{__(
										'Track how often visitors clicked your accessibility widget to open it so you see how many people are actively seeking accessibility features on your site.',
										'pojo-accessibility',
									)}
								</Typography>
							}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					</Box>
				}
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
