import PropTypes from 'prop-types';

export const scannerItem = PropTypes.shape({
	ruleId: PropTypes.string.isRequired,
	value: PropTypes.arrayOf(
		PropTypes.oneOf([
			'PASS',
			'FAIL',
			'POTENTIAL',
			'MANUAL',
			'VIOLATION',
			'RECOMMENDATION',
			'INFORMATION',
		]),
	).isRequired,
	path: PropTypes.shape({
		dom: PropTypes.string.isRequired,
		aria: PropTypes.string.isRequired,
		selector: PropTypes.string,
	}).isRequired,
	messageArgs: PropTypes.arrayOf(PropTypes.string),
	reasonCategory: PropTypes.string.isRequired,
	category: PropTypes.string.isRequired,
	level: PropTypes.string.isRequired,
	node: PropTypes.object,
	parentNode: PropTypes.object,
	isPotential: PropTypes.bool,
	isEdit: PropTypes.bool,
	global: PropTypes.bool,
});
