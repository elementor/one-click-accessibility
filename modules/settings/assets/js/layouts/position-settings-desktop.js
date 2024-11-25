import Box from '@elementor/ui/Box';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { AlignmentMatrixControl, PositionControl } from '@ea11y/components';
import { useIconPosition } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

export const PositionSettingsDesktop = () => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const toggleVisibility = ( device ) => {
		updateIconPosition( device, 'hidden', ! iconPosition[ device ].hidden );
	};

	const toggleExactPosition = ( device ) => {
		updateIconPosition( device, 'enableExactPosition', ! iconPosition[ device ].enableExactPosition );
	};

	const hideOnDesktopLabel = <Typography variant="subtitle2"
		marginRight={ 2 }
		color="text.primary">{ __( 'Hide on desktop', 'pojo-accessibility' ) }</Typography>;

	const exactPositionLabel = <Typography variant="subtitle2"
		color="text.primary"
		marginRight={ 2 }>{ __( 'Exact position', 'pojo-accessibility' ) }</Typography>;

	return (
		<>
			<FormControlLabel label={ hideOnDesktopLabel }
				labelPlacement="start"
				control={ <Switch color="info" size="small" /> }
				sx={ { marginLeft: 2, marginBottom: 3 } }
				onChange={ () => toggleVisibility( 'desktop' ) } />
			{ ! iconPosition.desktop.hidden &&
				<Box display="grid"
					gridTemplateColumns="repeat(2,1fr)"
					justifyContent="space-evenly"
					padding={ 2 }
					gap={ 5 }>
					<AlignmentMatrixControl mode="desktop" />
					<Box>
						<FormControlLabel label={ exactPositionLabel }
							labelPlacement="start"
							control={ <Switch color="info" size="small" /> }
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
