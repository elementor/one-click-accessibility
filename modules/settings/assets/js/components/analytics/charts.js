import { ChevronDownIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Grid from '@elementor/ui/Grid';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import SvgIcon from '@elementor/ui/SvgIcon';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { LineChart } from '@ea11y/components/analytics/line-chart';
import { PieChart } from '@ea11y/components/analytics/pie-chart';
import { UsageTable } from '@ea11y/components/analytics/usage-table';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const Charts = () => {
	const { showAnalytics, period, setPeriod } = useAnalyticsContext();

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
					<LineChart />
				</Grid>
				<Grid item xs={12} lg={6}>
					<PieChart />
				</Grid>
				<Grid item xs={12}>
					<UsageTable />
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
