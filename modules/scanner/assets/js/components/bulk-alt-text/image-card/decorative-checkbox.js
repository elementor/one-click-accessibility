import Checkbox from '@elementor/ui/Checkbox';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const DecorativeCheckbox = ({ checked, onChange }) => {
	return (
		<FormControlLabel
			control={<Checkbox color="secondary" checked={checked} size="small" />}
			label={
				<Typography variant="body2" color="text.secondary">
					{__('Mark as decorative', 'pojo-accessibility')}
				</Typography>
			}
			onChange={onChange}
			sx={{ paddingInline: 1.7, paddingBlockEnd: 1.5 }}
		/>
	);
};

DecorativeCheckbox.propTypes = {
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default DecorativeCheckbox;
