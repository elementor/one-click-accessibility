import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';

export const closeWidget = (widget) => {
	removeExistingFocus();
	widget.remove();
	document.body.style.removeProperty('margin-right');
	document.body.prepend(window.ea11yScannerData.adminBar);
};
