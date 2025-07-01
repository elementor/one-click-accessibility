import { ChevronLeftIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import Drawer from '@elementor/ui/Drawer';
import IconButton from '@elementor/ui/IconButton';
import { styled } from '@elementor/ui/styles';
import { SidebarMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { QuotaBar } from '@ea11y/layouts';
import { __ } from '@wordpress/i18n';

const Sidebar = () => {
	const { openSidebar, setOpenSidebar } = useSettings();

	return (
		<Drawer
			variant="permanent"
			open={openSidebar}
			sx={{ width: 'auto' }}
			PaperProps={{
				sx: {
					position: 'relative',
					width: !openSidebar ? '80px' : '260px',
					transition: 'all 0.3s',
					height: `calc(100% - 52.5px)`,
					justifyContent: 'space-between',
					paddingTop: 0,
					overflow: 'visible',
				},
			}}
		>
			<StyledIconButton
				onClick={() => setOpenSidebar(!openSidebar)}
				size="small"
				aria-label={__('Toggle sidebar', 'pojo-accessibility')}
			>
				<ChevronLeftIcon
					fontSize="tiny"
					role="img"
					sx={{ rotate: !openSidebar ? '180deg' : '0' }}
				/>
			</StyledIconButton>
			<Box padding={1.5}>
				<SidebarMenu />
			</Box>
			<Box>
				<Divider />
				<QuotaBar />
			</Box>
		</Drawer>
	);
};

export default Sidebar;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	right: -15px;
	top: 20px;
	z-index: 999999;

	border: 1px solid ${({ theme }) => theme.palette.divider};
	background: ${({ theme }) => theme.palette.background.paper};

	:hover {
		background: ${({ theme }) => theme.palette.background.paper};
	}
`;
