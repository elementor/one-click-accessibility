import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormLabel from '@elementor/ui/FormLabel';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { useIconPosition } from '../../hooks';

const AlignmentMatrixControl = ( { mode } ) => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const handleChange = ( event ) => {
		updateIconPosition( mode, 'position', event.target.value );
	};

	// Define options based on the mode
	const options = [
		{ value: 'top-left', label: __( 'Top Left', 'pojo-accessibility' ) },
		...( mode === 'desktop' ? [
			{ value: 'top-center', label: __( 'Top Center', 'pojo-accessibility' ) },
		] : [] ),
		{ value: 'top-right', label: __( 'Top Right', 'pojo-accessibility' ) },
		{ value: 'center-left', label: __( 'Center Left', 'pojo-accessibility' ) },
		{ value: 'center-right', label: __( 'Center Right', 'pojo-accessibility' ) },
		{ value: 'bottom-left', label: __( 'Bottom Left', 'pojo-accessibility' ) },
		...( mode === 'desktop' ? [
			{ value: 'bottom-center', label: __( 'Bottom Center', 'pojo-accessibility' ) },
		] : [] ),
		{ value: 'bottom-right', label: __( 'Bottom Right', 'pojo-accessibility' ) },
	];

	return (
		<FormControl>
			<FormLabel id="alignment-matrix-control" color="secondary">
				<Typography variant="subtitle2" marginBottom={ 1 }>
					{ __( 'Default Position', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<Box display="flex"
				justifyContent="center"
				padding={ 2 }
				width="100%"
				sx={ { backgroundColor: 'divider' } }
			>
				<RadioGroup
					aria-labelledby="alignment-matrix-control"
					value={ iconPosition[ mode ].position }
					onChange={ handleChange }
					name="alignment-matrix-control"
					sx={ {
						display: 'grid',
						gridTemplateColumns: mode === 'desktop' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
						gap: 1,
						alignItems: 'center',
						borderWidth: 5,
						borderStyle: 'solid',
						borderColor: 'secondary.main',
						borderRadius: 1,
						width: mode === 'desktop' ? '300px' : '100px',
					} }
				>
					{ options.map( ( option ) =>
						<Tooltip title={ option.label } key={ option.value }>
							<FormControlLabel sx={ { margin: 0, gridColumn: option.value === 'center-left' ? 'span 2' : 'span 1' } }
								value={ option.value }
								control={ <Radio color="secondary" /> } />
						</Tooltip>,
					) }
				</RadioGroup>
			</Box>
		</FormControl>
	);
};

export default AlignmentMatrixControl;
