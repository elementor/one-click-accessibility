import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ChevronUpIcon from '@elementor/icons/ChevronUpIcon';
import ExternalLinkIcon from '@elementor/icons/ExternalLinkIcon';
import Box from '@elementor/ui/Box';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Menu from '@elementor/ui/Menu';
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
						<ListItemButton
							key={type.label}
							shape="rounded"
							href={type.url}
							onClick={() => sendAnalytics(type.label)}
							target="_blank"
						>
							<ListItemText
								primary={type.label}
								sx={{ whiteSpace: 'nowrap' }}
							/>

							<ListItemIcon>
								<ExternalLinkIcon role="presentation" />
							</ListItemIcon>
						</ListItemButton>
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
