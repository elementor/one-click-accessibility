import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { useSettings } from '@ea11y/hooks';
import { cloneElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getOptionByValue } from '../../helpers/accessibility-options';

const IconSize = ( props ) => {
	const { widgetIcon, widgetIconSize, setWidgetIconSize, widgetIconColor } = useSettings();
	const icon = getOptionByValue( widgetIcon );

	const options = [
		{ value: 'large', fontSize: 64 },
		{ value: 'medium', fontSize: 44 },
		{ value: 'small', fontSize: 36 },
	];
	return (
		<FormControl>
			<FormLabel id="icon-size-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={ 1 }>
					{ __( 'Size', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<RadioGroup
				{ ...props }
				aria-labelledby="icon-size-radio-buttons-group-label"
				name="icon-size-radio-buttons-group"
				value={ widgetIconSize }
				sx={ {
					display: 'flex',
					flexDirection: 'row',
					gap: 2,
				} }
			>
				{ options.map( ( option ) => (
					<Paper
						key={ option.value }
						variant="outlined"
						onClick={ () => setWidgetIconSize( option.value ) }
						sx={ {
							borderRadius: 'md',
							boxShadow: 'sm',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							flexGrow: 1,
							gap: 1.5,
							p: 2,
							minWidth: 10,
							minHeight: 100,
							borderColor: widgetIconSize === option.value ? 'info.main' : 'divider',
							borderWidth: widgetIconSize === option.value ? 2 : 1,
							cursor: 'pointer',
						} }
					>{ icon?.icon && cloneElement( icon.icon, { sx: { color: widgetIconColor, fontSize: option.fontSize } } ) }
						<Radio value={ option.value } sx={ { opacity: 0, position: 'absolute' } } />
					</Paper>
				) ) }
			</RadioGroup>
		</FormControl>
	);
};

export default IconSize;
