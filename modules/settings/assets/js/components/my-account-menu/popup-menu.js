import CalendarDollarIcon from '@elementor/icons/CalendarDollarIcon';
import ExternalLinkIcon from '@elementor/icons/ExternalLinkIcon';
import UserIcon from '@elementor/icons/UserIcon';
import Avatar from '@elementor/ui/Avatar';
import Box from '@elementor/ui/Box';
import Chip from '@elementor/ui/Chip';
import Divider from '@elementor/ui/Divider';
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

export const PopupMenu = (menuProps) => {
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
			<StyledBox>
				<Avatar sx={{ width: 32, height: 32 }}>
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
							size="tiny"
							sx={{ width: 'fit-content', marginTop: 0.5 }}
						/>
					)}
				</Box>
			</StyledBox>
			<Divider />

			<StyledMenuItem dense onClick={onDeactivateAndDisconnect}>
				<UserArrowIcon sx={{ color: 'action.active' }} />

				<StyledTypography>
					{__('Switch account', 'pojo-accessibility')}
				</StyledTypography>
			</StyledMenuItem>

			<StyledMenuItem
				dense
				sx={{ width: '100%', justifyContent: 'space-between' }}
				onClick={() => window.open(ELEMENTOR_URL)}
			>
				<Box display="flex" flexDirection="row">
					<CalendarDollarIcon sx={{ color: 'action.active' }} />

					<StyledTypography>
						{__('Subscription', 'pojo-accessibility')}
					</StyledTypography>
				</Box>

				<ExternalLinkIcon sx={{ color: 'text.primary' }} />
			</StyledMenuItem>
		</Menu>
	);
};

export default PopupMenu;

const StyledMenuItem = styled(MenuItem)`
	&.MuiMenuItem-gutters:focus,
	&.MuiMenuItem-gutters:focus-visible {
		box-shadow: inset 0 0 0 3px #5e9ed6;
	}
`;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	gap: ${({ theme }) => theme.spacing(1)};
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
`;

const StyledTypography = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.primary};
	margin-left: ${({ theme }) => theme.spacing(1)};
	font-size: 14px;
`;
