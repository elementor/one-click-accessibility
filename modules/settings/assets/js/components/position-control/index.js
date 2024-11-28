import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import InputAdornment from '@elementor/ui/InputAdornment';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import { usePopupState, bindTrigger, bindMenu } from '@elementor/ui/usePopupState';
import { useIconPosition } from '@ea11y/hooks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const units = [ 'PX', 'REM', 'EM' ];

const horizontalOptions = [
	{ value: 'to-left', label: __( 'To the left', 'pojo-accessibility' ) },
	{ value: 'to-right', label: __( 'To the right', 'pojo-accessibility' ) },
];

const verticalOptions = [
	{ value: 'higher', label: __( 'Higher', 'pojo-accessibility' ) },
	{ value: 'lower', label: __( 'Lower', 'pojo-accessibility' ) },
];

// Customization for the WP admin global CSS.
const StyledTextField = styled( TextField )( () => ( {
	width: '200px',
	'.wp-admin & .MuiInputBase-input, & .MuiInputBase-input:focus': {
		backgroundColor: 'initial',
		boxShadow: 'none',
		border: 0,
		color: 'inherit',
		outline: 0,
		padding: '16.5px 14px 16.5px 14px',
		'&.MuiInputBase-inputSizeSmall': {
			padding: '8.5px 14px 8.5px 14px',
		},
		height: '56px',
	},
} ) );

const PositionControl = ( { type, disabled, mode } ) => {
	const { iconPosition, updateExactPosition } = useIconPosition();
	const [ unitsIndex, setUnitsIndex ] = useState( 0 );
	const popupState = usePopupState( {
		variant: 'popover',
		popupId: 'position-settings',
	} );

	const handleMenuItemClick = ( index ) => {
		setUnitsIndex( index );
		updateExactPosition(
			mode,
			type,
			iconPosition[ mode ].exactPosition[ type ].direction,
			iconPosition[ mode ].exactPosition[ type ].value,
			units[ index ],
		);
		popupState.close();
	};
	const handlePositionChange = ( event ) => {
		updateExactPosition(
			mode,
			type,
			iconPosition[ mode ].exactPosition[ type ].direction,
			event.target.value,
			iconPosition[ mode ].exactPosition[ type ].unit,
		);
	};
	const handlePositionDirection = ( event ) => {
		updateExactPosition(
			mode,
			type,
			event.target.value,
			iconPosition[ mode ].exactPosition[ type ].value,
			iconPosition[ mode ].exactPosition[ type ].unit,
		);
	};
	return (
		<Box
			display="flex"
			gap={ 1 }
			marginTop={ 2 }>
			<StyledTextField
				size="medium"
				disabled={ disabled }
				value={ iconPosition[ mode ]?.exactPosition?.[ type ].value }
				onChange={ handlePositionChange }
				InputProps={ {
					endAdornment: (
						<InputAdornment position="end">
							<Button
								size="small"
								color="inherit"
								sx={ { font: 'inherit', minWidth: 'initial' } }
								{ ...bindTrigger( popupState ) }
								disabled={ disabled }
							>
								{ units[ unitsIndex ] }
							</Button>
							<Menu MenuListProps={ { dense: true } } { ...bindMenu( popupState ) }>
								{ units.map( ( unit, index ) => (
									<MenuItem key={ unit } onClick={ () => handleMenuItemClick( index ) }>
										{ unit }
									</MenuItem>
								) ) }
							</Menu>
						</InputAdornment>
					),
				} }
			/>
			<Select
				fullWidth
				onChange={ handlePositionDirection }
				disabled={ disabled }
				value={ iconPosition[ mode ]?.exactPosition?.[ type ].direction }
				MenuProps={ {
					MenuListProps: {
						sx: {
							minWidth: 150,
						},
					},
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left',
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left',
					},
				} }
			>
				{
					type === 'horizontal' ? horizontalOptions.map( ( option ) => (
						<MenuItem key={ option.value } value={ option.value }>
							{ option.label }
						</MenuItem>
					) ) : verticalOptions.map( ( option ) => (
						<MenuItem key={ option.value } value={ option.value }>
							{ option.label }
						</MenuItem>
					) )
				}
			</Select>
		</Box>
	);
};

export default PositionControl;
