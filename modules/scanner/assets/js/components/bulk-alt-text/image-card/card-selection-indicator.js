import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import CircularProgress from '@elementor/ui/CircularProgress';
import Radio from '@elementor/ui/Radio';
import PropTypes from 'prop-types';
import { __, sprintf } from '@wordpress/i18n';

const CardSelectionIndicator = ({
	imageLabel,
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

	const label = imageLabel
		? sprintf(
				/* translators: %s: image file name or "Image" */
				__('Add image %s to bulk alt text editing', 'pojo-accessibility'),
				imageLabel,
			)
		: __('Add image to bulk alt text editing', 'pojo-accessibility');

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
			tabIndex={0}
			aria-label={label}
		/>
	);
};

CardSelectionIndicator.propTypes = {
	imageLabel: PropTypes.string,
	isLoading: PropTypes.bool.isRequired,
	isSelected: PropTypes.bool.isRequired,
	hasValidAltText: PropTypes.bool,
	onRadioClick: PropTypes.func.isRequired,
};

export default CardSelectionIndicator;
