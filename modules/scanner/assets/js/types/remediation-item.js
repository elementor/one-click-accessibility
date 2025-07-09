import PropTypes from 'prop-types';

export const remediationItem = PropTypes.shape({
	id: PropTypes.number.isRequired,
	url: PropTypes.string.isRequired,
	active: PropTypes.bool.isRequired,
	category: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	group: PropTypes.string.isRequired,
	rule: PropTypes.string.isRequired,
	created_at: PropTypes.string.isRequired,
	updated_at: PropTypes.string.isRequired,
});
