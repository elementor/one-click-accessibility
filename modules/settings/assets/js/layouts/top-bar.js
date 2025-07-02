import AppBar from '@elementor/ui/AppBar';
import Box from '@elementor/ui/Box';
import Toolbar from '@elementor/ui/Toolbar';
import Typography from '@elementor/ui/Typography';
import { AppLogo } from '@ea11y/icons';
import { TopBarMenu } from '@ea11y/layouts';
import { __ } from '@wordpress/i18n';

const TopBar = () => {
	return (
		<AppBar
			position="static"
			color="transparent"
			elevation={0}
			variant="outlined"
		>
			<Toolbar
				disableGutters
				variant="dense"
				sx={{ justifyContent: 'space-between', padding: 1 }}
			>
				<Box display="flex" flexDirection="row" gap={1} alignItems="center">
					<AppLogo />
					<Typography variant="h6" color="text.primary">
						{__('Ally', 'pojo-accessibility')}
					</Typography>
				</Box>
				<TopBarMenu />
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
