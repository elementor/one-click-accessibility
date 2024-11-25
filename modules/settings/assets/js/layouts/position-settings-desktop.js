import Box from '@elementor/ui/Box';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { AlignmentMatrixControl, PositionControl } from '@ea11y/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const PositionSettingsDesktop = () => {
	const [ hiddenOnDesktop, setHiddenOnDesktop ] = useState( false );
	const [ disableExactPosition, setDisableExactPosition ] = useState( true );
	return (
		<>
			<FormControlLabel label={ <Typography variant="subtitle2">{ __( 'Hide on desktop', 'pojo-accessibility' ) }</Typography> }
				labelPlacement="start"
				control={ <Switch color="info" /> }
				sx={ { marginLeft: 0, marginBottom: 3 } }
				onChange={ () => setHiddenOnDesktop( ! hiddenOnDesktop ) } />
			{ ! hiddenOnDesktop &&
				<Box display="grid"
					gridTemplateColumns="repeat(2,1fr)"
					gap={ 3 }>
					<AlignmentMatrixControl />
					<Box>
						<FormControlLabel label={ <Typography variant="subtitle2">{ __( 'Exact position', 'pojo-accessibility' ) }</Typography> }
							labelPlacement="start"
							control={ <Switch color="info" /> }
							sx={ { marginLeft: 0 } }
							onChange={ () => setDisableExactPosition( ! disableExactPosition ) } />
						<PositionControl type="horizontal" disabled={ disableExactPosition } />
						<PositionControl type="vertical" disabled={ disableExactPosition } />
					</Box>
				</Box>
			}
		</>
	);
};

export default PositionSettingsDesktop;
