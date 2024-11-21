import Box from '@elementor/ui/Box';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { AlignmentMatrixControl, PositionControl } from '../components';
import { useIconPosition } from '../hooks';

export const PositionSettingsDesktop = () => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const toggleVisibility = ( device ) => {
		updateIconPosition( device, 'hidden', ! iconPosition[ device ].hidden );
	};

	const toggleExactPosition = ( device ) => {
		updateIconPosition( device, 'enableExactPosition', ! iconPosition[ device ].enableExactPosition );
	};

	return (
		<>
			<FormControlLabel label={ <Typography variant="subtitle2">{ __( 'Hide on desktop', 'pojo-accessibility' ) }</Typography> }
				labelPlacement="start"
				control={ <Switch color="info" /> }
				sx={ { marginLeft: 0, marginBottom: 3 } }
				onChange={ () => toggleVisibility( 'desktop' ) } />
			{ ! iconPosition.desktop.hidden &&
				<Box display="grid"
					gridTemplateColumns="repeat(2,1fr)"
					gap={ 3 }>
					<AlignmentMatrixControl mode="desktop" />
					<Box>
						<FormControlLabel label={ <Typography variant="subtitle2">{ __( 'Exact position', 'pojo-accessibility' ) }</Typography> }
							labelPlacement="start"
							control={ <Switch color="info" /> }
							sx={ { marginLeft: 0 } }
							onChange={ () => toggleExactPosition( 'desktop' ) } />
						<PositionControl type="horizontal"
							mode="desktop"
							disabled={ ! iconPosition.desktop?.enableExactPosition } />
						<PositionControl type="vertical"
							mode="desktop"
							disabled={ ! iconPosition.desktop?.enableExactPosition } />
					</Box>
				</Box>
			}
		</>
	);
};
