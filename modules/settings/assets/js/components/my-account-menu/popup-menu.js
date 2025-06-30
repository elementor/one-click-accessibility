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
import { useSettings, useStorage } from '@ea11y/hooks';
import { UserArrowIcon } from '@ea11y/icons';
import { ELEMENTOR_URL } from '@ea11y-apps/global/constants';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import API from '../../api/index';
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
	return (
		<Menu
			{...menuProps}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			PaperProps={{
				sx: {
					backgroundColor: 'common.white',
				},
			}}
			/* eslint-disable-next-line jsx-a11y/no-autofocus */
			autoFocus={false}
		>
			<StyledMenuItem onClick={closeAction} sx={{ gap: 1, width: '240px' }}>
				<Avatar>
					<UserIcon sx={{ color: 'common.white' }} />
				</Avatar>

				<Box display="flex" flexDirection="column" gap={0}>
					<Tooltip title={planData?.user?.email}>
						<Typography variant="caption" color="text.primary">
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
				<UserArrowIcon sx={{ color: 'action.active' }} />

				<Typography color="text.primary" marginLeft={1}>
					{__('Switch account', 'pojo-accessibility')}
				</Typography>
			</StyledMenuItem>

			<StyledMenuItem
				sx={{ width: '100%', justifyContent: 'space-between' }}
				onClick={() => window.open(ELEMENTOR_URL)}
			>
				<Box display="flex" flexDirection="row">
					<CalendarDollarIcon sx={{ color: 'action.active' }} />

					<Typography color="text.primary" marginLeft={1}>
						{__('Subscription', 'pojo-accessibility')}
					</Typography>
				</Box>

				<ExternalLinkIcon sx={{ color: 'text.primary' }} />
			</StyledMenuItem>
		</Menu>
	);
};

export default PopupMenu;
