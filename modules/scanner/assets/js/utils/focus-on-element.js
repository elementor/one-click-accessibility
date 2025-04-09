import { CURRENT_ELEMENT_CLASS } from '@ea11y-apps/scanner/utils/constants';

export const focusOnElement = (domPath) => {
	removeExistingFocus();
	const result = document.evaluate(
		domPath,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null,
	);
	const element = result.singleNodeValue;
	element.classList.add(CURRENT_ELEMENT_CLASS);
	element.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const removeExistingFocus = () => {
	document.querySelectorAll(`.${CURRENT_ELEMENT_CLASS}`).forEach((element) => {
		element.classList.remove(CURRENT_ELEMENT_CLASS);
	});
};
