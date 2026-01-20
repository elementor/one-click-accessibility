import ChevronLeftIcon from '@elementor/icons/ChevronLeftIcon';
import Divider from '@elementor/ui/Divider';
import Drawer from '@elementor/ui/Drawer';
import IconButton from '@elementor/ui/IconButton';
import { styled } from '@elementor/ui/styles';
import { SidebarHeading, SidebarMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { QuotaBar } from '@ea11y/layouts';
import { __ } from '@wordpress/i18n';
import { usePluginSettingsContext } from '../contexts/plugin-settings';

const Sidebar = () => {
	const { openSidebar, setOpenSidebar } = useSettings();
	const { isElementorOne } = usePluginSettingsContext();

	return (
		<StyledDrawer
			variant="permanent"
			open={openSidebar}
			role="navigation"
			aria-label={__('Sidebar', 'pojo-accessibility')}
		>
			<StyledToggleButton
				onClick={() => setOpenSidebar(!openSidebar)}
				size="small"
				aria-label={__('Toggle sidebar', 'pojo-accessibility')}
			>
				<ChevronLeftIcon
					aria-hidden={true}
					fontSize="tiny"
					sx={{ rotate: !openSidebar ? '180deg' : '0' }}
				/>
			</StyledToggleButton>

			<SidebarHeaderWrapper>
				<SidebarHeading />
				<Divider />
			</SidebarHeaderWrapper>

			<SidebarMenuWrapper>
				<SidebarMenu />
			</SidebarMenuWrapper>

			{!isElementorOne && (
				<SidebarFooterWrapper>
					<Divider />
					<QuotaBar />
				</SidebarFooterWrapper>
			)}
		</StyledDrawer>
	);
};

export default Sidebar;

const StyledToggleButton = styled(IconButton)`
	position: absolute;
	inset-inline-end: -15px;
	inset-block-start: 58px;
	z-index: 999999;

	border: 1px solid ${({ theme }) => theme.palette.divider};
	background: ${({ theme }) => theme.palette.background.paper};

	:hover,
	:focus-visible {
		background: #f3f3f4;
	}
`;

const StyledDrawer = styled(Drawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})`
	width: auto;
	& .MuiDrawer-paper {
		position: relative;
		width: ${({ open }) => (open ? '240px' : '72px')};
		height: 100%;
		justify-content: space-between;
		padding-block-start: 0;
		overflow: visible;
		transition: all 0.3s;
	}
`;

const SidebarHeaderWrapper = styled('div')`
	flex-shrink: 0;
	padding: ${({ theme }) => theme.spacing(2, 2, 0)};
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
`;

const SidebarMenuWrapper = styled('div')`
	flex: 1;
	padding: ${({ theme }) => theme.spacing(2)};
	overflow-y: auto;
`;

const SidebarFooterWrapper = styled('div')`
	flex-shrink: 0;
`;
