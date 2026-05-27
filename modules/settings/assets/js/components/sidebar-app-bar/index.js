import AppBar from '@elementor/ui/AppBar';
import IconButton from '@elementor/ui/IconButton';
import Rotate from '@elementor/ui/Rotate';
import Toolbar from '@elementor/ui/Toolbar';
import { useSettings } from '@ea11y/hooks';
import { SquareRoundedChevronsLeft } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';

const SidebarAppBar = () => {
	const { openSidebar, setOpenSidebar } = useSettings();

	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Toolbar
				disableGutters
				variant="dense"
				sx={{ justifyContent: 'space-between' }}
			>
				<IconButton
					color="inherit"
					onClick={() => setOpenSidebar(!openSidebar)}
					size="small"
				>
					<Rotate in={!openSidebar}>
						<SquareRoundedChevronsLeft
							role="img"
							aria-label={__('Toggle sidebar', 'pojo-accessibility')}
						/>
					</Rotate>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default SidebarAppBar;
