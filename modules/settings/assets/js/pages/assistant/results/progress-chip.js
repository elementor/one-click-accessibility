import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Chip from '@elementor/ui/Chip';
import PropTypes from 'prop-types';

const ProgressChip = ({ color, percentage }) => {
	return (
		<Chip
			size="tiny"
			color={color}
			variant="standard"
			label={`${percentage}%`}
		/>
	);
};

const AccessibilityAssistantResultsTableProgressChip = ({ percentage }) => {
	if (percentage <= 25) {
		return <ProgressChip color="error" percentage={percentage} />;
	}

	if (percentage > 25 && percentage <= 60) {
		return <ProgressChip color="warning" percentage={percentage} />;
	}

	if (percentage > 60 && percentage < 100) {
		return <ProgressChip color="default" percentage={percentage} />;
	}

	return <CircleCheckFilledIcon fontSize="small" color="success" />;
};

AccessibilityAssistantResultsTableProgressChip.propTypes = {
	percentage: PropTypes.number.isRequired,
};

export default AccessibilityAssistantResultsTableProgressChip;
