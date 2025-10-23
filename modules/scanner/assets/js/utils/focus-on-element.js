import {
	BACKGROUND_ELEMENT_CLASS,
	COLOR_ELEMENT_CLASS,
	CURRENT_ELEMENT_CLASS,
} from '@ea11y-apps/scanner/constants';

export const focusOnElement = (element, queryClass = null) => {
	removeExistingFocus(queryClass);
	if (element) {
		element.classList.add(queryClass ?? CURRENT_ELEMENT_CLASS);
		if (queryClass !== BACKGROUND_ELEMENT_CLASS) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
};

export const removeExistingFocus = (queryClass = null) => {
	document
		.querySelectorAll(
			queryClass
				? `.${queryClass}`
				: `.${CURRENT_ELEMENT_CLASS}, .${COLOR_ELEMENT_CLASS}, .${BACKGROUND_ELEMENT_CLASS}`,
		)
		.forEach((element) => {
			element.classList.remove(
				CURRENT_ELEMENT_CLASS,
				COLOR_ELEMENT_CLASS,
				BACKGROUND_ELEMENT_CLASS,
			);
		});
};
