import {
	CalendarDollarIcon,
	ExternalLinkIcon,
	UserIcon,
} from '@elementor/icons';
import Avatar from '@elementor/ui/Avatar';
import Box from '@elementor/ui/Box';
import Chip from '@elementor/ui/Chip';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { UserArrowIcon } from '@ea11y/icons';
import { eventNames, mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import API from '../../api/index';
import { SUBSCRIPTION_LINK } from '../../constants/index';
import { truncateEmail } from '../../helpers/popup-menu';

const StyledMenuItem = styled(MenuItem)`
	&.MuiMenuItem-gutters:focus,
	&.MuiMenuItem-gutters:focus-visible {
		box-shadow: inset 0 0 0 3px #5e9ed6;
	}
`;

export const PopupMenu = (menuProps, { closeAction }) => {
	const { save } = useStorage();
	const { error } = useToastNotification();
	const { planData } = useSettings();

	const onDeactivateAndDisconnect = async () => {
		try {
			await API.deactivate();
			await API.redirectToConnect();

			await save({
				ea11y_close_post_connect_modal: false,
			});

			mixpanelService.sendEvent(eventNames.menuButtonClicked, {
				buttonName: 'Switch account',
			});
		} catch (e) {
			error(
				__('Failed to switch account. Please try again.', 'pojo-accessibility'),
			);

			console.error(e);
		}
	};
	return (
		<Menu
			{...menuProps}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			PaperProps={{
				sx: {
					backgroundColor: 'text.primary',
				},
			}}
		>
			<StyledMenuItem onClick={closeAction} sx={{ gap: 1, width: '240px' }}>
				<Avatar>
					<UserIcon sx={{ color: 'common.white' }} />
				</Avatar>

				<Box display="flex" flexDirection="column" gap={0}>
					<Tooltip title={planData?.user?.email}>
						<Typography variant="caption" color="common.white">
							{truncateEmail(planData?.user?.email)}
						</Typography>
					</Tooltip>

					{planData?.plan?.name && (
						<Chip
							color="info"
							variant="standard"
							label={planData?.plan?.name}
							size="small"
							sx={{ width: 'fit-content', marginTop: 0.5 }}
						/>
					)}
				</Box>
			</StyledMenuItem>

			<StyledMenuItem onClick={onDeactivateAndDisconnect}>
				<UserArrowIcon sx={{ color: 'common.white' }} />

				<Typography color="common.white" marginLeft={1}>
					{__('Switch account', 'pojo-accessibility')}
				</Typography>
			</StyledMenuItem>

			<StyledMenuItem
				sx={{ width: '100%', justifyContent: 'space-between' }}
				onClick={() => window.open(SUBSCRIPTION_LINK)}
			>
				<Box display="flex" flexDirection="row">
					<CalendarDollarIcon sx={{ color: 'common.white' }} />

					<Typography color="common.white" marginLeft={1}>
						{__('Subscription', 'pojo-accessibility')}
					</Typography>
				</Box>

				<ExternalLinkIcon sx={{ color: 'common.white' }} />
			</StyledMenuItem>
		</Menu>
	);
};

export default PopupMenu;
