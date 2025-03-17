import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Modal from '@elementor/ui/Modal';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import CrownFilled from '@ea11y/icons/crown-filled';
import { StyledContainer } from '@ea11y/pages/pages.styles';
import { eventNames, mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import imageUrl from '../../../img/upgrade.png';
import { UPGRADE_LINK } from '../../constants';

const UpgradeModal = () => {
	const onUpgrade = () => {
		mixpanelService.sendEvent(eventNames.upgradeButtonClicked, {
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
									'Get a clear view of your accessibility data',
									'pojo-accessibility',
								)}
							</Typography>
							<Typography
								variant="body2"
								id="upgrade-modal-description"
								align="center"
							>
								{__(
									'Upgrade to a premium plan to unlock your accessibility analytics. Track key metrics, understand user engagement, and gain insights to for improvements.',
									'pojo-accessibility',
								)}
							</Typography>
						</Box>
						<Button
							href={UPGRADE_LINK}
							size="large"
							color="accent"
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
