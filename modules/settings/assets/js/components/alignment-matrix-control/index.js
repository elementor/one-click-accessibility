import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormLabel from '@elementor/ui/FormLabel';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AlignmentMatrixControl = () => {
	const [ selectedValue, setSelectedValue ] = useState( 'center-right' );

	const handleChange = ( event ) => {
		setSelectedValue( event.target.value );
	};

	const options = [
		{ value: 'top-left', label: __( 'Top Left', 'pojo-accessibility' ) },
		{ value: 'top-right', label: __( 'Top Right', 'pojo-accessibility' ) },
		{ value: 'center-left', label: __( 'Center Left', 'pojo-accessibility' ) },
		{ value: 'center-right', label: __( 'Center Right', 'pojo-accessibility' ) },
		{ value: 'bottom-left', label: __( 'Bottom Left', 'pojo-accessibility' ) },
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
					value={ selectedValue }
					onChange={ handleChange }
					name="alignment-matrix-control"
					sx={ {
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 1,
						borderWidth: 5,
						borderStyle: 'solid',
						borderColor: 'secondary.main',
						borderRadius: 1,
						width: '100px',
					} }
				>
					{ options.map( ( option, i ) => <FormControlLabel sx={ { margin: 0 } }
						key={ i }
						value={ option.value }
						control={ <Radio color="secondary" /> } /> ) }
				</RadioGroup>
			</Box>
		</FormControl>
	);
};

export default AlignmentMatrixControl;
