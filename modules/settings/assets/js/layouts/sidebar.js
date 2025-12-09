import ChevronLeftIcon from '@elementor/icons/ChevronLeftIcon';
import Divider from '@elementor/ui/Divider';
import Drawer from '@elementor/ui/Drawer';
import IconButton from '@elementor/ui/IconButton';
import { styled } from '@elementor/ui/styles';
import { SidebarHeading, SidebarMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { QuotaBar } from '@ea11y/layouts';
import { __ } from '@wordpress/i18n';

const Sidebar = () => {
	const { openSidebar, setOpenSidebar } = useSettings();

	return (
		<StyledDrawer variant="permanent" open={openSidebar}>
			<StyledToggleButton
				onClick={() => setOpenSidebar(!openSidebar)}
				size="small"
				aria-label={__('Toggle sidebar', 'pojo-accessibility')}
			>
				<ChevronLeftIcon
					fontSize="tiny"
					role="img"
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

			<SidebarFooterWrapper>
				<Divider />
				<QuotaBar />
			</SidebarFooterWrapper>
		</StyledDrawer>
	);
};

export default Sidebar;

const StyledToggleButton = styled(IconButton)`
	position: absolute;
	inset-inline-end: -15px;
	inset-block-start: 61px;
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
		width: ${({ open }) => (open ? '260px' : '74px')};
		height: 100%;
		justify-content: space-between;
		padding-block-start: 0;
		overflow: visible;
		transition: all 0.3s;
	}
`;

const SidebarHeaderWrapper = styled('div')`
	flex-shrink: 0;
	padding-block: ${({ theme }) => theme.spacing(2.5, 1)};
	padding-inline: ${({ theme }) => theme.spacing(1.5)};
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1.5)};
`;

const SidebarMenuWrapper = styled('div')`
	flex: 1;
	padding-inline: ${({ theme }) => theme.spacing(1.5)};
	overflow-y: auto;
`;

const SidebarFooterWrapper = styled('div')`
	flex-shrink: 0;
`;
