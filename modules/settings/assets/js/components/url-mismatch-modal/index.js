import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { ConfirmDialog } from '@ea11y/components';
import { useModal, useToastNotification } from '@ea11y/hooks';
import { AppLogo } from '@ea11y/icons';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import API from '../../api';

const UrlMismatchModal = () => {
	const { open, close } = useModal(true);
	const { error } = useToastNotification();
	const [showNewConnectionConfirmation, setShowNewConnectionConfirmation] =
		useState(false);

	const onUpdateConnectUrl = async () => {
		try {
			const connectUrl = await API.initConnect('update');

			window.open(connectUrl, '_self').focus();
		} catch (e) {
			error(__('An error occurred.', 'pojo-accessibility'));
		}

		close();
	};

	const onConnectAsNewSite = async () => {
		try {
			setShowNewConnectionConfirmation(false);
			await API.clearSession();

			window.location.href = addQueryArgs(window.location.href, {
				action: 'connect',
			});
		} catch (e) {
			error(__('An error occurred.', 'pojo-accessibility'));
		}

		close();
	};

	const showConfirmation = () => setShowNewConnectionConfirmation(true);
	const hideConfirmation = () => setShowNewConnectionConfirmation(false);

	return (
		<>
			<StyledConfirmDialog
				open={open}
				onClose={close}
				logo={<AppLogo />}
				title={__('Fix mismatched URL', 'pojo-accessibility')}
				showCancelButton={false}
				showApproveButton={false}
				maxWidth="lg"
				fullWidth={true}
				dividers={true}
			>
				<StyledGridContainer>
					<StyledTitle variant="h4">
						{__('Select the case that applies to you', 'pojo-accessibility')}
					</StyledTitle>
					<StyledSubtitle variant="body1">
						{__(
							'Your license key does not match your current domain, causing a mismatch. This is most likely due to a change in the domain URL of your site.',
							'pojo-accessibility',
						)}
					</StyledSubtitle>

					<StyledGridContainer2>
						<StyledCard>
							<StyledCardTitle variant="h6" marginBottom={3}>
								{__('Are you updating the URL?', 'pojo-accessibility')}
							</StyledCardTitle>

							<StyledCardSubtitle variant="body1" marginBottom={3}>
								{__(
									'Choose this option if you want to just switch to the new URL, for the same site, and keep all previous history.',
									'pojo-accessibility',
								)}
							</StyledCardSubtitle>

							<Button variant="text" onClick={onUpdateConnectUrl} color="info">
								{__('Update connected URL', 'pojo-accessibility')}
							</Button>
						</StyledCard>

						<StyledCard>
							<StyledCardTitle variant="h6" marginBottom={3}>
								{__('Are you creating a new site?', 'pojo-accessibility')}
							</StyledCardTitle>

							<StyledCardSubtitle variant="body1" marginBottom={3}>
								{__(
									'Choose this if you are connecting the plugin to a new site. This will delete all previous history.',
									'pojo-accessibility',
								)}
							</StyledCardSubtitle>

							<Button variant="text" onClick={showConfirmation} color="info">
								{__('Connect as a new site', 'pojo-accessibility')}
							</Button>
						</StyledCard>
					</StyledGridContainer2>
				</StyledGridContainer>
			</StyledConfirmDialog>

			{showNewConnectionConfirmation && (
				<ConfirmDialog
					onClose={hideConfirmation}
					onCancel={hideConfirmation}
					title={__(
						'Are you sure you want to connect as a new site?',
						'pojo-accessibility',
					)}
					approveText={__('Connect', 'pojo-accessibility')}
					onApprove={onConnectAsNewSite}
				>
					<Typography variant="body1">
						{__(
							'Connecting as a new site will delete data related to the current site.',
							'pojo-accessibility',
						)}
					</Typography>
				</ConfirmDialog>
			)}
		</>
	);
};

export default UrlMismatchModal;

const StyledCard = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	width: 38%;
	padding: 40px;

	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 4px;

	text-align: center;

	@media screen and (max-width: 768px) {
		width: 100%;
	}

	& span {
		margin-right: 24px;
	}
`;

const StyledCardTitle = styled(Typography)`
	font-size: 16px;
	color: ${({ theme }) => theme.palette.text.primary};
`;

const StyledCardSubtitle = styled(Typography)`
	font-size: 14px;
	color: ${({ theme }) => theme.palette.text.secondary};
`;

const StyledGridContainer = styled(Grid)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-left: ${({ theme }) => theme.spacing(8)};
	padding-right: ${({ theme }) => theme.spacing(8)};
`;

const StyledGridContainer2 = styled(Grid)`
	justify-content: space-between;
	display: flex;
	margin-top: 80px;
	margin-bottom: 80px;
`;

const StyledTitle = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.primary};
	margin-top: ${({ theme }) => theme.spacing(5)};
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledSubtitle = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.secondary};
	margin-bottom: ${({ theme }) => theme.spacing(1)};
	text-align: center;
	width: 70%;
`;

const StyledConfirmDialog = styled(ConfirmDialog)`
	margin-left: 10%;
	& .MuiDialogContent-dividers {
		border-bottom: none;
	}
`;
