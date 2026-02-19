import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const CardActionButtons = ({ onSave, onCancel, altText }) => {
	return (
		<Grid container gap={1} justifyContent="flex-end" marginBlockStart={1}>
			<Button size="small" variant="text" color="secondary" onClick={onCancel}>
				{__('Cancel', 'pojo-accessibility')}
			</Button>
			<Button
				size="small"
				variant="contained"
				color="secondary"
				onClick={onSave}
				disabled={!altText?.trim()}
			>
				{__('Save', 'pojo-accessibility')}
			</Button>
		</Grid>
	);
};

CardActionButtons.propTypes = {
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	altText: PropTypes.string,
};

export default CardActionButtons;
