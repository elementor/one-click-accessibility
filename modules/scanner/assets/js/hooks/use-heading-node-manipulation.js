export const useHeadingNodeManipulation = ({ node }) => {
	const hasDraft = () => {
		return node.getAttribute('data-ea11y-scanner-heading-draft');
	};

	const getOriginalHeadingLevel = () => {
		const originalLevel = node.getAttribute(
			'data-ea11y-scanner-original-level',
		);

		if (originalLevel) {
			return parseInt(originalLevel, 10);
		}

		return null;
	};

	const getDraftLevelForDisplay = () => {
		if (!hasDraft()) {
			return '';
		}

		const role = node.getAttribute('role');

		if ('none' === role) {
			return 'p';
		}

		const ariaLevel = node.getAttribute('aria-level');

		return `h${ariaLevel}`;
	};

	const backupOriginalAttributes = () => {
		if (hasDraft()) {
			return;
		}

		const role = node.getAttribute('role');
		const ariaLevel = node.getAttribute('aria-level');

		node.setAttribute('data-ea11y-scanner-heading-draft', 'true');
		node.setAttribute('data-ea11y-scanner-original-role', role || '');
		node.setAttribute('data-ea11y-scanner-original-level', ariaLevel || '');
	};

	const restoreOriginalAttributes = () => {
		if (!hasDraft()) {
			return;
		}

		const originalRole = node.getAttribute('data-ea11y-scanner-original-role');
		const originalAriaLevel = node.getAttribute(
			'data-ea11y-scanner-original-level',
		);

		if (originalRole) {
			node.setAttribute('role', originalRole);
		} else {
			node.removeAttribute('role');
		}

		if (originalAriaLevel) {
			node.setAttribute('aria-level', originalAriaLevel);
		} else {
			node.removeAttribute('aria-level');
		}

		node.removeAttribute('data-ea11y-scanner-original-role');
		node.removeAttribute('data-ea11y-scanner-original-level');
		node.removeAttribute('data-ea11y-scanner-heading-draft');
	};

	const clearOriginalAttributes = () => {
		node.removeAttribute('data-ea11y-scanner-original-role');
		node.removeAttribute('data-ea11y-scanner-original-level');
		node.removeAttribute('data-ea11y-scanner-heading-draft');
	};

	const applyNewLevel = (value) => {
		backupOriginalAttributes();

		if (value === 'p') {
			/**
			 * Don't change this one to 'presentation'!
			 *
			 * Here it must be 'none' to allow preview validation to happen without the element
			 * to be removed from the tree. We also don't want to stop applying the attribute, so the user can
			 * see if the layout changes in case of selectors like [role="banner"].
			 */
			node.setAttribute('role', 'none');
			node.removeAttribute('aria-level');
		} else {
			node.setAttribute('role', 'heading');
			node.setAttribute('aria-level', value[1]);
		}
	};

	return {
		hasDraft,
		getOriginalHeadingLevel,
		getDraftLevelForDisplay,
		backupOriginalAttributes,
		restoreOriginalAttributes,
		clearOriginalAttributes,
		applyNewLevel,
	};
};
