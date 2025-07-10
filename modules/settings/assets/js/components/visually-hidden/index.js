import { isValidElement, cloneElement } from '@wordpress/element';

const visuallyHiddenStyle = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	margin: '-1px',
	border: '0',
	padding: '0',
	whiteSpace: 'nowrap',
	clipPath: 'inset(100%)',
	clip: 'rect(0 0 0 0)',
	overflow: 'hidden',
};

const VisuallyHidden = ({ children }) => {
	if (!isValidElement(children)) {
		console.warn(
			'VisuallyHidden expects a single valid React element as a child.',
		);
		return null;
	}

	return cloneElement(children, {
		style: { ...(children.props.style || {}), ...visuallyHiddenStyle },
	});
};

export default VisuallyHidden;
