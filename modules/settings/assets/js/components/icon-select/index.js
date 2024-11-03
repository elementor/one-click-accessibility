import Avatar from '@elementor/ui/Avatar';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Example SVG icon components (replace these with your actual SVG icons)
const SmallIcon = () => <svg width="32"
	height="32"
	viewBox="0 0 24 24"><circle cx="12"
		cy="12"
		r="10" /></svg>;
const MediumIcon = () => <svg width="44"
	height="44"
	viewBox="0 0 24 24"><rect x="4"
		y="4"
		width="16"
		height="16" /></svg>;
const LargeIcon = () => <svg width="64"
	height="64"
	viewBox="0 0 24 24"><polygon points="12,2 2,22 22,22" /></svg>;
const ExtraLargeIcon = () => <svg width="88"
	height="88"
	viewBox="0 0 24 24"><path d="M5,3 L19,21" /></svg>;

const IconSelect = ( props ) => {
	const [ selectedValue, setSelectedValue ] = useState( 'small' );

	const options = [
		{ value: 'small', icon: <SmallIcon />, label: __( 'Small (32px)', 'pojo-accessibility' ) },
		{ value: 'medium', icon: <MediumIcon />, label: __( 'Medium (44px)', 'pojo-accessibility' ) },
		{ value: 'large', icon: <LargeIcon />, label: __( 'Large (64px)', 'pojo-accessibility' ) },
		{ value: 'extraLarge', icon: <ExtraLargeIcon />, label: __( 'Extra Large (88px)', 'pojo-accessibility' ) },
	];

	return (
		<FormControl>
			<FormLabel id="icon-select-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2">
					{ __( 'Icon', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<RadioGroup
				{ ...props }
				aria-labelledby="icon-select-radio-buttons-group-label"
				name="icon-select-radio-buttons-group"
				value={ selectedValue }
				sx={ {
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: 2,
				} }
			>
				{ options.map( ( option ) => (
					<Paper
						key={ option.value }
						variant="outlined"
						onClick={ () => setSelectedValue( option.value ) }
						sx={ {
							borderRadius: 'md',
							boxShadow: 'sm',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 1.5,
							p: 2,
							minWidth: 120,
							borderColor: selectedValue === option.value ? 'blue' : 'grey.300',
							borderWidth: selectedValue === option.value ? 1 : 1,
							cursor: 'pointer',
						} }
					>
						<Avatar>
							{ option.icon }
						</Avatar>
						<Radio value={ option.value } sx={ { opacity: 0, position: 'absolute' } } />
					</Paper>
				) ) }
			</RadioGroup>
		</FormControl>
	);
};

export default IconSelect;
