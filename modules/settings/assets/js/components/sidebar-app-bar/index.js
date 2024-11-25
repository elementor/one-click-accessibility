import AppBar from '@elementor/ui/AppBar';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Toolbar from '@elementor/ui/Toolbar';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../../hooks';
import {
	ElementorLogo,
	SquareRoundedChevronsLeft,
} from '../../icons';

const SidebarAppBar = () => {
	const { openSidebar, setOpenSidebar } = useSettings();

	return ( <AppBar position="static" color="transparent" >
		<Toolbar disableGutters sx={ { justifyContent: 'space-between' } } >
			<Box display="flex"
				alignItems="center"
				justifyContent="center"
				p={ 1 }>
				<ElementorLogo />
				<Typography variant="h6"
					marginLeft={ 1 }
					display={ ! openSidebar ? 'none' : 'inherit' }>
					{ __( 'Accessibility', 'pojo-accessibility' ) }
				</Typography>
			</Box>
			<IconButton color="inherit" onClick={ () => setOpenSidebar( ! openSidebar ) }>
				<SquareRoundedChevronsLeft sx={ { rotate: ! openSidebar ? '180deg' : '0' } } />
			</IconButton>
		</Toolbar>
	</AppBar> );
};

export default SidebarAppBar;
