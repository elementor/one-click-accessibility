import { ChevronDownIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import SvgIcon from '@elementor/ui/SvgIcon';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
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

	return showAnalytics ? (
		<Box>
			<FormControlLabel
				control={
					<Select
						onChange={changePeriod}
						value={period}
						size="small"
						IconComponent={() => (
							<StyledIcon>
								<ChevronDownIcon />
							</StyledIcon>
						)}
						sx={{ width: '270px', ml: 2, position: 'relative' }}
						variant="outlined"
					>
						<MenuItem value={0}>{__('Today', 'site-mailer')}</MenuItem>
						<MenuItem value={1}>{__('Yesterday', 'site-mailer')}</MenuItem>
						<MenuItem value={7}>{__('Last 7 days', 'site-mailer')}</MenuItem>
						<MenuItem value={30}>{__('Last 30 days', 'site-mailer')}</MenuItem>
					</Select>
				}
				label={
					<Typography variant="subtitle1">
						{__('Clicks overview for', 'pojo-accessibility')}
					</Typography>
				}
				labelPlacement="start"
				sx={{ ml: 0 }}
			/>
		</Box>
	) : null;
};

const StyledIcon = styled(SvgIcon)`
	position: absolute;
	top: 50%;
	right: 8px;
	cursor: pointer;
	pointer-events: none;
	transform: translateY(-50%);
`;
