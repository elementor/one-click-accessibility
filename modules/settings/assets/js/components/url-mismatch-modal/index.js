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
			<ConfirmDialog
				open={open}
				onClose={close}
				logo={<AppLogo />}
				title={__('Fix mismatched URL', 'pojo-accessibility')}
				showCancelButton={false}
				showApproveButton={false}
				maxWidth="md"
				fullWidth={true}
				dividers={true}
			>
				<Grid
					container
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
				>
					<Typography
						variant="h4"
						color="text.primary"
						marginTop={5}
						marginBottom={1}
					>
						{__('Select the case that applies to you', 'pojo-accessibility')}
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						marginBottom={1}
						textAlign="center"
						width="70%"
					>
						{__(
							'Your license key does not match your current domain, causing a mismatch. This is most likely due to a change in the domain URL of your site.',
							'pojo-accessibility',
						)}
					</Typography>

					<Grid
						container
						justifyContent="space-between"
						marginTop={10}
						marginBottom={10}
					>
						<StyledCard>
							<StyledTitle variant="h6" marginBottom={3}>
								{__('Are you updating the URL?', 'pojo-accessibility')}
							</StyledTitle>

							<StyledSubtitle variant="body1" marginBottom={3}>
								{__(
									'Choose this option if you want to just switch to the new URL, for the same site, and keep all previous history.',
									'pojo-accessibility',
								)}
							</StyledSubtitle>

							<Button variant="text" onClick={onUpdateConnectUrl} color="info">
								{__('Update connected URL', 'pojo-accessibility')}
							</Button>
						</StyledCard>

						<StyledCard>
							<StyledTitle variant="h6" marginBottom={3}>
								{__('Are you creating a new site?', 'pojo-accessibility')}
							</StyledTitle>

							<StyledSubtitle variant="body1" marginBottom={3}>
								{__(
									'Choose this if you are connecting the plugin to a new site. This will delete all previous history.',
									'pojo-accessibility',
								)}
							</StyledSubtitle>

							<Button variant="text" onClick={showConfirmation} color="info">
								{__('Connect as a new site', 'pojo-accessibility')}
							</Button>
						</StyledCard>
					</Grid>
				</Grid>
			</ConfirmDialog>

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

const StyledTitle = styled(Typography)`
	font-size: 16px;
	color: ${({ theme }) => theme.palette.text.primary};
`;

const StyledSubtitle = styled(Typography)`
	font-size: 14px;
	color: ${({ theme }) => theme.palette.text.secondary};
`;
