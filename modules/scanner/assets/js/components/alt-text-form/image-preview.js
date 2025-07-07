import PropTypes from 'prop-types';
import { StyledPaper } from '@ea11y-apps/scanner/styles/alt-text-form.styles';
import { useEffect, useRef } from '@wordpress/element';

export const ImagePreview = ({ element }) => {
	const previewRef = useRef(null);

	useEffect(() => {
		if (!element || !previewRef.current) {
			return;
		}

		// Only allow previewing safe elements
		const tag = element.tagName.toLowerCase();
		const allowedTags = ['img', 'svg'];

		if (!allowedTags.includes(tag)) {
			return;
		}

		const clone = element.cloneNode(true); // Deep clone

		// Remove inline styles from the cloned element
		clone.removeAttribute('style');
		clone.style.cssText = '';
		clone.setAttribute('role', 'presentation');

		previewRef.current.innerHTML = ''; // Clear previous
		previewRef.current.appendChild(clone);
	}, [element]);

	return (
		<StyledPaper color="secondary" elevation={0} square ref={previewRef} />
	);
};

ImagePreview.propTypes = {
	element: PropTypes.instanceOf(Node).isRequired,
};
