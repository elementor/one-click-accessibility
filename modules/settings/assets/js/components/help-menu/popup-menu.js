import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { openLink } from '../../utils';

export const HelpPopupMenu = (menuProps) => {
	const { setIsGetStartedModalOpen } = useSettings();

	const handleGetStartedClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			popupType: 'get_started_with_ally',
			buttonName: 'Get started with Ally',
		});
		setIsGetStartedModalOpen(true);

		if (menuProps.closeAction) {
			menuProps.closeAction();
		}
	};

	const handleHelpCenterClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.helpButtonClicked, {
			source: 'Header',
		});
		openLink(GOLINKS.HELP);
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
				horizontal: 'right',
			}}
			PaperProps={{
				sx: {
					backgroundColor: 'common.white',
				},
			}}
			/* eslint-disable-next-line jsx-a11y/no-autofocus */
			autoFocus={false}
		>
			<StyledMenuItem dense onClick={handleGetStartedClick}>
				<StyledTypography>
					{__('Get started with Ally', 'pojo-accessibility')}
				</StyledTypography>
			</StyledMenuItem>

			<StyledMenuItem
				dense
				sx={{ width: '100%', justifyContent: 'space-between' }}
				onClick={handleHelpCenterClick}
			>
				<StyledTypography>
					{__('Help center', 'pojo-accessibility')}
				</StyledTypography>
			</StyledMenuItem>
		</Menu>
	);
};

export default HelpPopupMenu;

const StyledMenuItem = styled(MenuItem)`
	&.MuiMenuItem-gutters:focus,
	&.MuiMenuItem-gutters:focus-visible {
		box-shadow: inset 0 0 0 3px #5e9ed6;
	}
`;

const StyledTypography = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 14px;
`;
