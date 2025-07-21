import PropTypes from 'prop-types';

export const scannerItem = PropTypes.shape({
	ruleId: PropTypes.string.isRequired,
	value: PropTypes.arrayOf(PropTypes.number).isRequired,
	path: PropTypes.shape({
		dom: PropTypes.string.isRequired,
		aria: PropTypes.string.isRequired,
		selector: PropTypes.string.isRequired,
	}).isRequired,
	messageArgs: PropTypes.arrayOf(PropTypes.string),
	reasonCategory: PropTypes.string.isRequired,
	category: PropTypes.string.isRequired,
	level: PropTypes.string.isRequired,
	node: PropTypes.node,
});
