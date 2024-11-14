import { ChevronDownIcon, PagesIcon, UserIcon } from '@elementor/icons';
import AppBar from '@elementor/ui/AppBar';
import Avatar from '@elementor/ui/Avatar';
import Box from '@elementor/ui/Box';
import Drawer from '@elementor/ui/Drawer';
import IconButton from '@elementor/ui/IconButton';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Toolbar from '@elementor/ui/Toolbar';
import Typography from '@elementor/ui/Typography';
import { usePopupState, bindTrigger, bindMenu } from '@elementor/ui/usePopupState';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CreditCardIcon, ElementorLogo, SquareRoundedChevronsLeft, UserArrowIcon, WidgetIcon } from '../icons';

export const Sidebar = () => {
	const [ showWidgetMenu, setShowWidgetMenu ] = useState( true );
	const [ openDrawer, setOpenDrawer ] = useState( true );

	const accountMenuState = usePopupState( { variant: 'popover', popupId: 'demoMenu' } );

	return (
		<Drawer variant="permanent"
			open={ openDrawer }
			PaperProps={ {
				sx: {
					position: 'relative',
					minWidth: '90px',
					maxWidth: '260px',
					width: openDrawer ? '100%' : '0',
					transition: 'all 0.3s',
					height: '100%',
					justifyContent: 'space-between',
				},
			} }
		>
			<Box>
				<AppBar position="static" color="transparent" >
					<Toolbar disableGutters sx={ { justifyContent: 'space-between' } } >
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
						<ListItemButton onClick={ () => setShowWidgetMenu( ! showWidgetMenu ) } sx={ { justifyContent: 'center' } } >
							<ListItemIcon>
								<WidgetIcon />
							</ListItemIcon>
							<ListItemText primary="Widget" hidden={ ! openDrawer } />
							<ListItemIcon sx={ { display: ! openDrawer ? 'none' : 'default' } }>
								<ChevronDownIcon sx={ { rotate: showWidgetMenu ? '180deg' : '0' } } />
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
						<ListItemButton sx={ { justifyContent: 'center' } }>
							<ListItemIcon>
								<PagesIcon sx={ { color: 'common.black' } } />
							</ListItemIcon>
							<ListItemText primary="Accessibility Statement" hidden={ ! openDrawer } />
						</ListItemButton>
					</ListItem>
				</List>
			</Box>
			<List>
				<ListItemButton { ...bindTrigger( accountMenuState ) }>
					<ListItemIcon>
						<UserIcon sx={ { color: 'common.black' } } />
					</ListItemIcon>
					<ListItemText primary="My Account" />
					<ListItemIcon sx={ { display: ! openDrawer ? 'none' : 'default' } }>
						<ChevronDownIcon />
					</ListItemIcon>
				</ListItemButton>
			</List>
			<Menu
				{ ...bindMenu( accountMenuState ) }
				anchorOrigin={ {
					vertical: 'top',
					horizontal: 'center',
				} }
				transformOrigin={ {
					vertical: 'bottom',
					horizontal: 'center',
				} }
				PaperProps={ { sx: {
					backgroundColor: 'text.primary',
				},
				} }
			>
				<MenuItem onClick={ accountMenuState.close } sx={ { gap: 1, width: '225px' } }>
					<Avatar>JB</Avatar>
					<Box display="flex"
						flexDirection="column"
						gap={ 0 }>
						<Typography variant="subtitle2" color="common.white">Jack Baueuer</Typography>
						<Typography variant="caption" color="common.white">jack@bauer.com</Typography>
					</Box>
				</MenuItem>
				<MenuItem onClick={ accountMenuState.close }>
					<UserArrowIcon sx={ { color: 'common.white' } } />
					<Typography color="common.white" marginLeft={ 1 }>
						{ __( 'Switch account', 'pojo-accessibility' ) }
					</Typography>
				</MenuItem>
				<MenuItem onClick={ accountMenuState.close }>
					<CreditCardIcon sx={ { color: 'common.white' } } />
					<Typography color="common.white" marginLeft={ 1 }>
						{ __( 'Billing', 'pojo-accessibility' ) }
					</Typography>
				</MenuItem>
			</Menu>
		</Drawer>
	);
};
