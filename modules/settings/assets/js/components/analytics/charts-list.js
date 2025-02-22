import { ChevronDownIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
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
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const ChartsList = () => {
	const { showAnalytics, loading, period, setPeriod } = useAnalyticsContext();

	/**
	 * Change period for statistics select
	 * @param {Object} event
	 */
	const changePeriod = (event) => {
		setPeriod(Number(event.target.value));
	};

	return (
		<Box display="flex" flexDirection="column" alignItems="start" gap={4}>
			<Box display="flex" alignItems="center" gap={2}>
				<Typography variant="subtitle1">
					{__('Clicks overview for', 'pojo-accessibility')}
				</Typography>
				<Select
					disabled={!showAnalytics}
					onChange={changePeriod}
					value={period}
					size="small"
					IconComponent={() => (
						<StyledIcon>
							<ChevronDownIcon />
						</StyledIcon>
					)}
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
					{loading ? <LineChartSkeleton /> : <LineChart />}
				</Grid>
				<Grid item xs={12} lg={6}>
					{loading ? <PieChartSkeleton /> : <PieChart />}
				</Grid>
				<Grid item xs={12}>
					{loading ? <UsageTableSkeleton /> : <UsageTable />}
				</Grid>
			</Grid>
		</Box>
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
