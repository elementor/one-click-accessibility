import HelpIcon from '@elementor/icons/HelpIcon';
import AppBar from '@elementor/ui/AppBar';
import Grid from '@elementor/ui/Grid';
import Link from '@elementor/ui/Link';
import Toolbar from '@elementor/ui/Toolbar';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { HELP_LINK } from '../../constants';
import ElementorLogo from '../../icons/elementor-logo';

const AdminTopBar = () => {
	return (
		<AppBar position="static"
			elevation={ 6 }
			sx={ { boxShadow: '0px 3px 16px 0px rgba(35, 38, 42, 0.20)' } } >
			<Toolbar direction="row"
				sx={ { alignItems: 'center', backgroundColor: 'background.default', gap: '10px' } }
				padding={ 2 }>
				<Grid container={ true }
					alignItems="center"
					gap={ 1 }>
					<ElementorLogo size="large" />
					<Typography color="text.primary">
						{ __( 'Accessibility', 'pojo-accessibility' ) }
					</Typography>
				</Grid>

				<Link color="secondary"
					underline="hover"
					href={ HELP_LINK }
					target="_blank"
					sx={ { display: 'inline-flex', alignItems: 'center', gap: 1 } }
					aria-label={ __( 'Help', 'pojo-accessibility' ) }>
					<HelpIcon />
				</Link>
			</Toolbar>
		</AppBar>
	);
};

export default AdminTopBar;
