import { useLayoutEffect, useRef } from '@wordpress/element';

/**
 * Prevents MUI's ModalManager from adding aria-hidden="true" to document.body
 * children. Inside a shadow root the ModalManager can't associate the modal
 * with its shadow host, so it inadvertently hides the shadow host (and
 * therefore the dialog itself) from screen readers.
 *
 * MUI sets aria-hidden via a ref callback during React's commit phase, before
 * any effects run. We capture a snapshot of pre-existing aria-hidden state
 * during render (before commit), then use useLayoutEffect to clean up what MUI
 * added and attach an observer for any future mutations.
 *
 * MUI issue: https://github.com/mui/material-ui/issues/19450
 *
 * @param {boolean} active
 */
const usePreventAriaHidden = (active) => {
	const snapshot = useRef(null);

	// Capture which body children already have aria-hidden during the render
	// phase, before React's commit phase where MUI's ref callbacks fire.
	if (active && snapshot.current === null) {
		const preserved = new Set();

		for (const child of document.body.children) {
			if (child.getAttribute('aria-hidden') !== null) {
				preserved.add(child);
			}
		}
		snapshot.current = preserved;
	}

	if (!active) {
		snapshot.current = null;
	}

	useLayoutEffect(() => {
		if (!active) {
			return;
		}

		const preserved = snapshot.current || new Set();

		const strip = (element) => {
			if (
				!preserved.has(element) &&
				element.getAttribute('aria-hidden') === 'true'
			) {
				element.removeAttribute('aria-hidden');
			}
		};

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'aria-hidden') {
					strip(mutation.target);
				}
			}
		});

		for (const child of document.body.children) {
			observer.observe(child, {
				attributes: true,
				attributeFilter: ['aria-hidden'],
			});

			// Clean up aria-hidden that MUI already set via ref callbacks
			// during the commit phase (before this layout effect ran).
			strip(child);
		}

		return () => {
			observer.disconnect();
		};
	}, [active]);
};

export default usePreventAriaHidden;
