import {
	BACKGROUND_ELEMENT_CLASS,
	COLOR_ELEMENT_CLASS,
	CURRENT_ELEMENT_CLASS,
	CURRENT_ELEMENT_DESCRIPTION,
	DATA_INITIAL_BG,
	DATA_INITIAL_COLOR,
} from '@ea11y-apps/scanner/constants';

export const focusOnElement = (element, queryClass = null) => {
	removeExistingFocus(queryClass);
	if (element) {
		setElementPosition(element);
		addDataDescription(element, queryClass);
		element.classList.add(queryClass ?? CURRENT_ELEMENT_CLASS);
		if (queryClass !== BACKGROUND_ELEMENT_CLASS) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
};

export const setElementPosition = (element) => {
	const currentPosition = window.getComputedStyle(element).position;
	if (currentPosition === 'static') {
		element.setAttribute('data-original-position', 'static');
		element.style.position = 'relative';
	}
};

export const removeElementPosition = (element) => {
	const position = element.getAttribute('data-original-position');
	if (position) {
		element.style.position = position;
		element.removeAttribute('data-original-position');
	}
};

export const addDataDescription = (element, queryClass) => {
	const description = queryClass
		? CURRENT_ELEMENT_DESCRIPTION[queryClass]
		: null;
	if (description) {
		element.setAttribute('data-before', description);
	}
};

export const resetStyles = (element) => {
	const bg = element.getAttribute(DATA_INITIAL_BG);
	const color = element.getAttribute(DATA_INITIAL_COLOR);

	if (bg && element?.style) {
		element.style['background-color'] = bg;
		element.removeAttribute(DATA_INITIAL_BG);
	}
	if (color && element?.style) {
		element.style.color = color;
		element.removeAttribute(DATA_INITIAL_COLOR);
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
			element.removeAttribute('data-before');
			removeElementPosition(element);
			resetStyles(element);
		});
};
