import HelpIcon from '@elementor/icons/HelpIcon';
import AppBar from '@elementor/ui/AppBar';
import Link from '@elementor/ui/Link';
import Toolbar from '@elementor/ui/Toolbar';
import { styled } from '@elementor/ui/styles';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';

const StyledToolbar = styled(Toolbar)`
	justify-content: end;
	align-items: center;
	flex-direction: row;
	background-color: ${({ theme }) => theme.palette.background.default};
	gap: 10px;
	border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const AdminTopBar = () => {
	return (
		<AppBar position="static">
			<StyledToolbar variant="dense">
				<Link
					color="secondary"
					underline="hover"
					href={GOLINKS.HELP}
					target="_blank"
					sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
					aria-label={__('Help', 'pojo-accessibility')}
					onClick={() =>
						mixpanelService.sendEvent(mixpanelEvents.helpButtonClicked, {
							source: 'Header',
						})
					}
				>
					<HelpIcon />
				</Link>
			</StyledToolbar>
		</AppBar>
	);
};

export default AdminTopBar;
