import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import InfoCircleFilledIcon from '@elementor/icons/InfoCircleFilledIcon';
import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import SvgIcon from '@elementor/ui/SvgIcon';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	LineChart,
	PieChart,
	UsageTable,
} from '@ea11y/components/analytics/charts';
import {
	LineChartSkeleton,
	PieChartSkeleton,
	UsageTableSkeleton,
} from '@ea11y/components/analytics/skeleton';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { dateI18n } from '@wordpress/date';
import { __, sprintf } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const ChartsList = () => {
	const {
		stats,
		isAnalyticsEnabled,
		isProVersion,
		loading,
		period,
		setPeriod,
		handleAnalyticsToggle,
	} = useAnalyticsContext();

	/**
	 * Change period for statistics select
	 * @param {Object} event
	 */
	const changePeriod = (event) => {
		setPeriod(Number(event.target.value));
		mixpanelService.sendEvent(mixpanelEvents.filterSelected, {
			selectedItem: event.target.value,
		});
	};

	const date = stats.dates.at(-1)?.date && new Date(stats.dates.at(-1)?.date);
	const availableDate = date && date.setDate(date.getDate() + 30);

	const hideAlert = !isProVersion || (availableDate && isAnalyticsEnabled);

	const isLoading = loading || !availableDate;

	return (
		<StyledBox>
			{!hideAlert && (
				<Alert
					color="info"
					icon={<InfoCircleFilledIcon />}
					sx={{ width: '100%' }}
					action={
						!availableDate &&
						!isAnalyticsEnabled && (
							<Button
								variant="outlined"
								color="info"
								size="small"
								onClick={() => handleAnalyticsToggle()}
							>
								{__('Enable tracking', 'pojo-accessibility')}
							</Button>
						)
					}
				>
					{availableDate && !isAnalyticsEnabled && (
						<>
							<AlertTitle sx={{ width: '100%' }}>
								{sprintf(
									// Translators: %s - date
									__('Data available till %s', 'pojo-accessibility'),
									dateI18n('Y/m/d', availableDate, false),
								)}
							</AlertTitle>
							{__(
								'We are showing you data collected in the past',
								'pojo-accessibility',
							)}
						</>
					)}
					{!availableDate && isAnalyticsEnabled && (
						<>
							<AlertTitle sx={{ width: '100%' }}>
								{__('Not enough data to show yet', 'pojo-accessibility')}
							</AlertTitle>
							{__(
								'Analytics appear once enough visitors interact with your accessibility widget.',
								'pojo-accessibility',
							)}
						</>
					)}
					{!availableDate && !isAnalyticsEnabled && (
						<>
							<AlertTitle sx={{ width: '100%' }}>
								{__('Analytics are off.', 'pojo-accessibility')}
							</AlertTitle>
							{__(
								'Switch on ״Track widget data״ to start collecting usage data for your widget.',
								'pojo-accessibility',
							)}
						</>
					)}
				</Alert>
			)}

			<Box display="flex" alignItems="center" gap={2}>
				<Typography variant="subtitle1">
					{__('Display data from', 'pojo-accessibility')}
				</Typography>
				<Select
					name={__('Period', 'pojo-accessibility')}
					onChange={changePeriod}
					value={period}
					size="small"
					IconComponent={() => (
						<StyledIcon>
							<ChevronDownIcon />
						</StyledIcon>
					)}
					color="secondary"
					sx={{ width: '270px', position: 'relative' }}
					variant="outlined"
				>
					<MenuItem value={0}>{__('Today', 'pojo-accessibility')}</MenuItem>
					<MenuItem value={1}>{__('Yesterday', 'pojo-accessibility')}</MenuItem>
					<MenuItem value={7}>
						{__('Last 7 days', 'pojo-accessibility')}
					</MenuItem>
					<MenuItem value={30}>
						{__('Last 30 days', 'pojo-accessibility')}
					</MenuItem>
				</Select>
			</Box>

			<Grid container spacing={4}>
				<Grid item xs={12} lg={6}>
					{isLoading ? <LineChartSkeleton animated={loading} /> : <LineChart />}
				</Grid>
				<Grid item xs={12} lg={6}>
					{isLoading ? <PieChartSkeleton animated={loading} /> : <PieChart />}
				</Grid>
				<Grid item xs={12}>
					{isLoading ? (
						<UsageTableSkeleton animated={loading} />
					) : (
						<UsageTable />
					)}
				</Grid>
			</Grid>
		</StyledBox>
	);
};

const StyledIcon = styled(SvgIcon)`
	position: absolute;
	top: 50%;
	right: 8px;
	cursor: pointer;
	pointer-events: none;
	transform: translateY(-50%);
`;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: ${({ theme }) => theme.spacing(4)};
	max-width: 1200px;

	margin-left: auto;
	margin-right: auto;
`;
