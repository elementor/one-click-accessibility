import CalendarDollarIcon from '@elementor/icons/CalendarDollarIcon';
import CrownIcon from '@elementor/icons/CrownIcon';
import PlugXIcon from '@elementor/icons/PlugXIcon';
import UserIcon from '@elementor/icons/UserIcon';
import Avatar from '@elementor/ui/Avatar';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Chip from '@elementor/ui/Chip';
import Divider from '@elementor/ui/Divider';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuSubheader from '@elementor/ui/MenuSubheader';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { QuotaBar } from '@ea11y/components';
import { useSettings, useStorage } from '@ea11y/hooks';
import { UserArrowIcon } from '@ea11y/icons';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { getUpgradeLink } from '@ea11y-apps/global/utils/upgrade-link';
import { __ } from '@wordpress/i18n';
import API from '../../api/index';
import { usePluginSettingsContext } from '../../contexts/plugin-settings';
import { truncateEmail } from '../../helpers/popup-menu';
import { openLink } from '../../utils';

export const PopupMenu = ({ closeAction, showUpgradeButton, ...menuProps }) => {
	const { save } = useStorage();
	const { error } = useToastNotification();
	const { planData } = useSettings();
	const { isElementorOne } = usePluginSettingsContext();

	const isFree = planData?.plan?.name === 'Free';

	const handleAccountSwitch = async () => {
		try {
			await API.deactivate();
			await API.redirectToConnect();

			await save({
				ea11y_close_post_connect_modal: false,
			});

			mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
				buttonName: 'Switch account',
			});
		} catch (e) {
			error(
				__('Failed to switch account. Please try again.', 'pojo-accessibility'),
			);

			console.error(e);
		}
	};

	const handlePlanUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			feature: 'upgrade plan',
			component: 'my account popup',
		});
		openLink(getUpgradeLink(GOLINKS.ADD_VISITS));
	};

	const handleSubscriptionDeactivation = () => {
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Deactivate subscription',
		});
		openLink(GOLINKS.MANAGE_SUBSCRIPTION.replace('{subscriptionId}/', ''));
	};

	const handleSubscriptionManagement = () => {
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Manage subscription',
		});
		openLink(
			GOLINKS.MANAGE_SUBSCRIPTION.replace(
				'{subscriptionId}',
				planData?.plan?.subscription_id,
			),
		);
	};

	return (
		<Menu
			{...menuProps}
			PaperProps={{
				sx: {
					backgroundColor: 'common.white',
					minWidth: 224,
				},
			}}
			/* eslint-disable-next-line jsx-a11y/no-autofocus */
			autoFocus={false}
		>
			{planData?.plan && (
				<StyledBox>
					<Avatar sx={{ width: 24, height: 24 }}>
						<UserIcon sx={{ color: 'common.white' }} />
					</Avatar>

					<Box display="flex" flexDirection="column" gap={0.5}>
						<Tooltip title={planData?.user?.email}>
							<Typography variant="caption" color="text.primary">
								{truncateEmail(planData?.user?.email)}
							</Typography>
						</Tooltip>

						{planData?.plan?.name && (
							<Chip
								variant="filled"
								label={planData?.plan?.name}
								size="tiny"
								sx={{ width: 'fit-content' }}
							/>
						)}
					</Box>
				</StyledBox>
			)}

			{planData?.plan && (
				<MenuSubheader disableGutters>
					<Divider sx={{ my: 1 }} />
				</MenuSubheader>
			)}

			{!isElementorOne && planData?.plan && (
				<QuotaSection as="li">
					<QuotaBar type="scanner" quotaData={planData?.scannedPages} />
					<QuotaBar type="ai" quotaData={planData?.aiCredits} />

					{!showUpgradeButton && (
						<Button
							variant="outlined"
							startIcon={isFree ? <CrownIcon /> : null}
							onClick={handlePlanUpgrade}
							size="small"
							fullWidth
							color={isFree ? 'promotion' : 'secondary'}
							sx={{ marginTop: 0.5 }}
						>
							{isFree
								? __('Upgrade plan', 'pojo-accessibility')
								: __('View more plans', 'pojo-accessibility')}
						</Button>
					)}
				</QuotaSection>
			)}

			{!isElementorOne && planData?.plan && (
				<MenuSubheader disableGutters>
					<Divider sx={{ my: 1 }} />
				</MenuSubheader>
			)}

			<StyledMenuItem dense onClick={handleAccountSwitch}>
				<UserArrowIcon sx={{ color: 'action.active' }} />

				<StyledTypography>
					{__('Switch account', 'pojo-accessibility')}
				</StyledTypography>
			</StyledMenuItem>

			<StyledMenuItem dense onClick={handleSubscriptionDeactivation}>
				<PlugXIcon sx={{ color: 'action.active' }} />

				<StyledTypography>
					{__('Deactivate subscription', 'pojo-accessibility')}
				</StyledTypography>
			</StyledMenuItem>

			<MenuSubheader disableGutters>
				<Divider sx={{ my: 1 }} />
			</MenuSubheader>

			<StyledMenuItem dense onClick={handleSubscriptionManagement}>
				<CalendarDollarIcon sx={{ color: 'action.active' }} />

				<StyledTypography>
					{__('Manage subscription', 'pojo-accessibility')}
				</StyledTypography>
			</StyledMenuItem>
		</Menu>
	);
};

export default PopupMenu;

const StyledMenuItem = styled(MenuItem)`
	gap: ${({ theme }) => theme.spacing(1)};

	&.MuiMenuItem-gutters:focus,
	&.MuiMenuItem-gutters:focus-visible {
		box-shadow: inset 0 0 0 3px #5e9ed6;
	}
`;

const StyledBox = styled(MenuItem)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	gap: ${({ theme }) => theme.spacing(1.5)};
	padding: ${({ theme }) => theme.spacing(0.5, 2)};
`;

const QuotaSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(0.5)};
	padding: ${({ theme }) => theme.spacing(1, 2)};
`;

const StyledTypography = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 14px;
`;
