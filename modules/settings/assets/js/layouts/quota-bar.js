import { EyeIcon, InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { ADD_VISITS_LINK } from '../constants/index';
import { openLink } from '../utils';

const QuotaBar = () => {
	const { planUsage, openSidebar, setOpenSidebar, planData } = useSettings();
	const plan = planData?.plan;
	console.log(plan);

	/**
	 * Get the color for the progress bar based on the usage.
	 * @return {string} The color for the progress bar.
	 */
	const progressBarColor = () => {
		if (planUsage < 80) {
			return 'info';
		}
		if (planUsage >= 80 && planUsage < 95) {
			return 'warning';
		}

		return 'error';
	};

	/**
	 * Send an event to Mixpanel when the user clicks on the "Add visits" button and open the link.
	 */
	const handleAddVisitsClick = () => {
		mixpanelService.sendEvent('upgrade_button_clicked', {
			feature: 'add visits',
			component: 'quota counter',
		});
		openLink(ADD_VISITS_LINK);
	};

	if (!openSidebar) {
		return (
			<IconButton
				sx={{ justifyContent: 'center', width: '100%', borderRadius: 0 }}
				onClick={() => setOpenSidebar(true)}
			>
				<EyeIcon sx={{ color: 'common.black' }} />
			</IconButton>
		);
	}
	return (
		<StyledBox>
			<EyeIcon />
			<Box display="inline-flex" flexDirection="column" gap={1} width="100%">
				<Box display="flex" justifyContent="space-between">
					<Typography
						variant="subtitle1"
						display="flex"
						alignItems="center"
						gap={1}
					>
						{__('Monthly visits', 'pojo-accessibility')}
						<Infotip
							placement="right"
							content={__(
								'The number of visits to your website.',
								'pojo-accessibility',
							)}
						>
							<InfoCircleIcon
								sx={{
									fontSize: 'medium',
								}}
							/>
						</Infotip>
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{__('20K', 'pojo-accessibility')}
					</Typography>
				</Box>
				<LinearProgress
					sx={{
						'& .MuiLinearProgress-bar': {
							animation: 'none',
						},
						animation: 'none',
					}}
					value={planUsage}
					variant="buffer"
					valueBuffer={100}
					color={progressBarColor()}
				/>
				<Typography variant="body2" color="text.tertiary">
					{`20K used (${planUsage}% of the limit)`}
				</Typography>
				<StyledButton
					variant="text"
					size="small"
					color="info"
					onClick={handleAddVisitsClick}
				>
					{__('Increase limit', 'pojo-accessibility')}
				</StyledButton>
			</Box>
		</StyledBox>
	);
};

export default QuotaBar;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: center;
	gap: ${({ theme }) => theme.spacing(2)};
	margin: ${({ theme }) => theme.spacing(2)};
	padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledButton = styled(Button)`
	justify-content: flex-start;
	padding: 0;
	:hover {
		background: none;
	}
`;
