import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Tooltip from '@elementor/ui/Tooltip';
import PropTypes from 'prop-types';

const AccessibilityAssistantTooltip = ({ content, children }) => {
	return (
		<Tooltip title={content} direction="top" arrow>
			{children ? (
				children
			) : (
				<InfoCircleIcon
					tabIndex="0"
					fontSize="tiny"
					sx={{ cursor: 'pointer' }}
				/>
			)}
		</Tooltip>
	);
};

AccessibilityAssistantTooltip.propTypes = {
	content: PropTypes.string.isRequired,
	children: PropTypes.node,
};

export default AccessibilityAssistantTooltip;
