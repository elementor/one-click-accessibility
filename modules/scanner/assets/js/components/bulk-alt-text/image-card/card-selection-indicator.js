import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import CircularProgress from '@elementor/ui/CircularProgress';
import Radio from '@elementor/ui/Radio';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const CardSelectionIndicator = ({
	isLoading,
	isSelected,
	hasValidAltText,
	onRadioClick,
}) => {
	if (isLoading) {
		return (
			<CircularProgress
				size={18}
				color="info"
				sx={{
					position: 'absolute',
					top: 12,
					right: 12,
				}}
			/>
		);
	}

	return (
		<Radio
			checked={isSelected}
			checkedIcon={<CircleCheckFilledIcon />}
			sx={{
				position: 'absolute',
				top: 0,
				right: 0,
				color: 'action.disabled',
				cursor: isSelected && hasValidAltText ? 'not-allowed' : 'pointer',
			}}
			color={isSelected && hasValidAltText ? 'success' : 'info'}
			onClick={onRadioClick}
			aria-label={__(
				'Add image to bulk alt text editing',
				'pojo-accessibility',
			)}
		/>
	);
};

CardSelectionIndicator.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	isSelected: PropTypes.bool.isRequired,
	hasValidAltText: PropTypes.bool,
	onRadioClick: PropTypes.func.isRequired,
};

export default CardSelectionIndicator;
