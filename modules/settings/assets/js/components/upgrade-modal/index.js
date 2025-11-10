import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Modal from '@elementor/ui/Modal';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { StyledContainer } from '@ea11y/pages/pages.styles';
import { GOLINKS } from '@ea11y-apps/global/constants';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import imageUrl from '../../../img/upgrade.png';

const UpgradeModal = () => {
	const onUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			component: 'Upgrade popup',
			feature: 'Analytic',
		});
	};

	return (
		<Modal
			open
			disablePortal
			hideBackdrop
			aria-labelledby="upgrade-modal-title"
			aria-describedby="upgrade-modal-description"
		>
			<StyledPaper elevation={24}>
				<StyledContainer>
					<StyledBox>
						<img
							src={imageUrl}
							alt={__('Upgrade image', 'pojo-accessibility')}
						/>
						<Box>
							<Typography
								variant="h5"
								id="upgrade-modal-title"
								align="center"
								sx={{ mb: 1 }}
							>
								{__(
									'Discover how visitors use your widget',
									'pojo-accessibility',
								)}
							</Typography>
							<Typography
								variant="body2"
								id="upgrade-modal-description"
								align="center"
							>
								{__(
									"Upgrade to a premium plan to access a clear view of your widget's analytics. Track key metrics, understand engagement, and gain insights for improvements.",
									'pojo-accessibility',
								)}
							</Typography>
						</Box>
						<Button
							href={GOLINKS.ANALYTICS_POPUP}
							target="_blank"
							size="large"
							color="promotion"
							startIcon={<CrownFilled />}
							variant="contained"
							sx={{ width: 300 }}
							onClick={onUpgrade}
						>
							{__('Upgrade now', 'pojo-accessibility')}
						</Button>
					</StyledBox>
				</StyledContainer>
			</StyledPaper>
		</Modal>
	);
};

const StyledPaper = styled(Paper)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600px;
	max-width: calc(100% - 48px);
	padding: 16px;
`;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 40px;
`;

export default UpgradeModal;
