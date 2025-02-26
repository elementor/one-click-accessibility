import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Modal from '@elementor/ui/Modal';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import CrownFilled from '@ea11y/icons/crown-filled';
import { StyledContainer } from '@ea11y/pages/pages.styles';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import imageUrl from '../../../img/upgrade.png';

const UpgradeModal = () => {
	const onUpgrade = () => {
		// TODO: add upgrade event
		mixpanelService.sendEvent('upgrade_button_clicked', {
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
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						gap={5}
					>
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
								{__('Upgrade to see the data', 'pojo-accessibility')}
							</Typography>
							<Typography
								variant="body2"
								id="upgrade-modal-description"
								align="center"
							>
								{__(
									'Get deep insights into your user behavior, engagement metrics, and more with our Premium plan.',
									'pojo-accessibility',
								)}
							</Typography>
						</Box>
						<Button
							size="large"
							color="accent"
							startIcon={<CrownFilled />}
							variant="contained"
							sx={{ width: 300 }}
							onClick={onUpgrade}
						>
							{__('Upgrade', 'pojo-accessibility')}
						</Button>
					</Box>
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
export default UpgradeModal;
