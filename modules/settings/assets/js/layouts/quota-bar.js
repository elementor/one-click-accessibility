import { EyeIcon, InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import LinearProgress from '@elementor/ui/LinearProgress';
import Skeleton from '@elementor/ui/Skeleton';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSavedSettings, useSettings } from '@ea11y/hooks';
import { eventNames, mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { GOLINKS } from '../constants/index';
import { formatPlanValue, openLink } from '../utils';

const QuotaBar = () => {
	const { planUsage, openSidebar, setOpenSidebar, planData } = useSettings();
	const { loading } = useSavedSettings();
	const quotaData = planData?.visits;

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
		mixpanelService.sendEvent(eventNames.upgradeButtonClicked, {
			feature: 'add visits',
			component: 'quota counter',
		});
		openLink(GOLINKS.ADD_VISITS);
	};

	if (loading) {
		return (
			<StyledBox>
				<Skeleton width="100%" height={91} />
			</StyledBox>
		);
	}

	if (!openSidebar) {
		return (
			<StyledBox>
				<IconButton onClick={() => setOpenSidebar(true)} sx={{ padding: 0 }}>
					<EyeIcon sx={{ color: 'common.black', marginRight: 1 }} />
				</IconButton>
			</StyledBox>
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
						noWrap
					>
						{__('Visits/month', 'pojo-accessibility')}
						<Infotip
							placement="right"
							PopperProps={{ sx: { width: '300px' } }}
							content={
								<Typography color="text.primary" padding={1}>
									{__(
										'This shows how many times your accessibility widget has loaded for unique visitors across all your connected sites this monthly cycle (each IP/device is counted once per 24 hours). If you’re nearing your plan’s monthly limit, you can upgrade to keep all features available.',
										'pojo-accessibility',
									)}
								</Typography>
							}
						>
							<InfoCircleIcon
								sx={{
									fontSize: 'medium',
								}}
							/>
						</Infotip>
					</Typography>
					{quotaData?.allowed && (
						<Typography variant="body2" color="text.secondary">
							{formatPlanValue(quotaData?.allowed)}
						</Typography>
					)}
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
				{quotaData && (
					<>
						<Typography variant="body2" color="text.tertiary" noWrap>
							{`${formatPlanValue(quotaData?.used)} loads (${planUsage}% of the limit)`}
						</Typography>
						<StyledButton
							variant="text"
							size="small"
							color="info"
							onClick={handleAddVisitsClick}
						>
							{__('Upgrade plan', 'pojo-accessibility')}
						</StyledButton>
					</>
				)}
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
	height: 120px;
`;

const StyledButton = styled(Button)`
	justify-content: flex-start;
	padding: 0;
	:hover {
		background: none;
	}
`;
