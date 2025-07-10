import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ChevronUpIcon from '@elementor/icons/ChevronUpIcon';
import ExternalLinkIcon from '@elementor/icons/ExternalLinkIcon';
import Box from '@elementor/ui/Box';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemIcon from '@elementor/ui/MenuItemIcon';
import MenuItemText from '@elementor/ui/MenuItemText';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import Button from '@ea11y/components/button';
import AccessibilityAssistantResultsSearch from '@ea11y/pages/assistant/results/search';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { useAccessibilityAssistantContext } from '../../../contexts/accessibility-assistant-context';

const AccessibilityAssistantResultsHeading = () => {
	const { postTypes, loading } = useAccessibilityAssistantContext();

	const pagesMenuState = usePopupState({
		variant: 'popover',
		popupId: 'myAccountMenu',
	});

	const sendAnalytics = (postType) => {
		mixpanelService.sendEvent(mixpanelEvents.assistantDashboardScanCtaClicked, {
			cta_text: `new_scan_${postType}`,
			source: 'main_table_cta',
		});
	};

	const onMenuItemClick = (e, url, buttonLabel) => {
		e.preventDefault();

		window.open(url, '_blank');

		sendAnalytics(buttonLabel);
	};

	return (
		<StyledHeadingContainer>
			<Typography variant="h6" as="h2">
				{__('Scanned URLs', 'pojo-accessibility')}
			</Typography>

			<StyledActionsContainer>
				<AccessibilityAssistantResultsSearch />

				<Button
					size="medium"
					color="info"
					variant="contained"
					endIcon={
						pagesMenuState.isOpen ? (
							<ChevronUpIcon fontSize="small" />
						) : (
							<ChevronDownIcon fontSize="small" />
						)
					}
					disabled={loading || !postTypes}
					{...bindTrigger(pagesMenuState)}
				>
					{__('New scan', 'pojo-accessibility')}
				</Button>

				<StyledMenu
					MenuListProps={{ dense: true }}
					{...bindMenu(pagesMenuState)}
					onClose={pagesMenuState.close}
				>
					{Object.values(postTypes).map((type) => (
						/**
						 * Both href and onClick placed here because at least @elementor/ui v1.34 doesn't
						 * really support `href` attribute for <MenuButton />.
						 *
						 * So, if we add a link button element and try to visit a link from a keyboard, it won't work.
						 * And if we only keep onClick handler then a link is impossible to open from the context menu.
						 *
						 * @param {PointerEvent} e
						 */
						<StyledMenuItem
							key={type.label}
							shape="rounded"
							onClick={(e) => onMenuItemClick(e, type.url, type.label)}
						>
							<StyledMenuButton href={type.url} target="_blank">
								<MenuItemText
									primary={type.label}
									sx={{ whiteSpace: 'nowrap' }}
								/>

								<MenuItemIcon>
									<ExternalLinkIcon fontSize="small" role="presentation" />
								</MenuItemIcon>
							</StyledMenuButton>
						</StyledMenuItem>
					))}
				</StyledMenu>
			</StyledActionsContainer>
		</StyledHeadingContainer>
	);
};

const StyledMenu = styled(Menu)`
	.MuiPaper-root {
		min-width: 195px;
		margin-top: ${({ theme }) => theme.spacing(1)};
	}

	.MuiList-root {
		padding-top: ${({ theme }) => theme.spacing(1.25)};
		padding-bottom: ${({ theme }) => theme.spacing(1.25)};
	}
`;

const StyledMenuItem = styled(MenuItem)`
	padding-top: 0;
	padding-bottom: 0;
	padding-inline-start: ${({ theme }) => theme.spacing(1.25)};
	padding-inline-end: ${({ theme }) => theme.spacing(0.75)};
`;

const StyledMenuButton = styled(Button)`
	width: 100%;
`;

const StyledHeadingContainer = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledActionsContainer = styled(Box)`
	display: flex;
	align-items: center;
`;

export default AccessibilityAssistantResultsHeading;
