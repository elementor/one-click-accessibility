import { ExternalLinkIcon } from '@elementor/icons';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { openLink } from '../../utils';
import GetStartedModal from './get-started-modal';

export const HelpPopupMenu = (menuProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleGetStartedClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Get started with Ally',
		});
		setIsModalOpen(true);
		// Close the menu
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
		<>
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

					<ExternalLinkIcon sx={{ color: 'text.primary' }} />
				</StyledMenuItem>
			</Menu>

			<GetStartedModal
				manualOpen={isModalOpen}
				onManualClose={() => setIsModalOpen(false)}
			/>
		</>
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
