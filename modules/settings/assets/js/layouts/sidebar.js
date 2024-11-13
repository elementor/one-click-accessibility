import { CheckedCircleIcon, ChevronDownIcon, PagesIcon, UserIcon } from '@elementor/icons';
import AppBar from '@elementor/ui/AppBar';
import Box from '@elementor/ui/Box';
import Container from '@elementor/ui/Container';
import Drawer from '@elementor/ui/Drawer';
import Grid from '@elementor/ui/Grid';
import IconButton from '@elementor/ui/IconButton';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Paper from '@elementor/ui/Paper';
import Toolbar from '@elementor/ui/Toolbar';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ElementorLogo, SquareRoundedChevronsLeft } from '../icons';

export const Sidebar = () => {
	const [ showWidgetMenu, setShowWidgetMenu ] = useState( true );
	const [ openDrawer, setOpenDrawer ] = useState( true );

	const StyledDrawer = styled( Drawer )
	` & .MuiDrawer-paper {
    margin-left: 160px;
    margin-top: 30px;
    min-width: 80px;
    max-width: 260px;
    width: ${ openDrawer ? '100%' : '0' }px;
    transition: all 0.3s;
}`;

	return (
		<StyledDrawer variant="permanent"
			open={ openDrawer }
		>
			<Box>
				<AppBar position="static" color="transparent" >
					<Toolbar disableGutters>
						<Box display="flex"
							alignItems="center"
							justifyContent="center"
							p={ 1 }>
							<ElementorLogo />
							<Typography variant="h6"
								marginLeft={ 1 }
								display={ ! openDrawer ? 'none' : 'inherit' }>
								{ __( 'Accessibility', 'pojo-accessibility' ) }
							</Typography>
						</Box>
						<IconButton color="inherit" onClick={ () => setOpenDrawer( ! openDrawer ) }>
							<SquareRoundedChevronsLeft sx={ { rotate: ! openDrawer ? '180deg' : '0' } } />
						</IconButton>
					</Toolbar>
				</AppBar>
				<List>
					<ListItem disableGutters>
						<ListItemButton onClick={ () => setShowWidgetMenu( ! showWidgetMenu ) }>
							<ListItemIcon>
								<CheckedCircleIcon />
							</ListItemIcon>
							<ListItemText primary="Widget" hidden={ ! openDrawer } />
							<ListItemIcon>
								<ChevronDownIcon />
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
					{
						showWidgetMenu && (
							<>
								<ListItem sx={ { py: 0 } } hidden={ ! openDrawer }>
									<ListItemButton sx={ { py: 0 } } hidden={ ! openDrawer }>
										<ListItemText primary="Icon Settings" hidden={ ! openDrawer } />
									</ListItemButton>
								</ListItem>
								<ListItem sx={ { py: 0 } } hidden={ ! openDrawer }>
									<ListItemButton sx={ { py: 0 } } hidden={ ! openDrawer }>
										<ListItemText primary="Menu" hidden={ ! openDrawer } />
									</ListItemButton>
								</ListItem>
							</>
						) }
					<ListItem disableGutters>
						<ListItemButton >
							<ListItemIcon>
								<PagesIcon />
							</ListItemIcon>
							<ListItemText primary="Accessibility Statement" hidden={ ! openDrawer } />
						</ListItemButton>
					</ListItem>
				</List>
				<List sx={ { position: 'absolute', bottom: 0 } }>
					<ListItem>
						<ListItemButton>
							<ListItemIcon>
								<UserIcon />
							</ListItemIcon>
							<ListItemText primary="My Account" hidden={ ! openDrawer } />
							<ListItemIcon>
								<ChevronDownIcon />
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				</List>
			</Box>
		</StyledDrawer>
	);
};
