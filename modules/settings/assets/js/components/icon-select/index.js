import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { useSettings } from '@ea11y/hooks';
import { cloneElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import options from '../../helpers/accessibility-options';

const IconSelect = ( props ) => {
	const { widgetIcon, setWidgetIcon, widgetIconColor } = useSettings();

	return (
		<FormControl>
			<FormLabel id="icon-select-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={ 1 }>
					{ __( 'Icon', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<RadioGroup
				{ ...props }
				aria-labelledby="icon-select-radio-buttons-group-label"
				name="icon-select-radio-buttons-group"
				value={ widgetIcon }
				sx={ {
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'nowrap',
					gap: 2,
				} }
			>
				{ options().map( ( option ) => (
					<Paper
						key={ option.value }
						variant="outlined"
						onClick={ () => setWidgetIcon( option.value ) }
						sx={ {
							borderRadius: 'md',
							boxShadow: 'sm',
							display: 'flex',
							flexDirection: 'column',
							flexGrow: 1,
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1.5,
							p: 2,
							minWidth: 10,
							minHeight: 100,
							borderColor: widgetIcon === option.value ? 'info.main' : 'divider',
							borderWidth: widgetIcon === option.value ? 2 : 1,
							cursor: 'pointer',
						} }
					>{ option.icon && cloneElement( option.icon, { sx: { color: widgetIconColor, fontSize: 44 } } ) }
						<Radio value={ option.value } sx={ { opacity: 0, position: 'absolute' } } />
					</Paper>
				) ) }
			</RadioGroup>
		</FormControl>
	);
};

export default IconSelect;
