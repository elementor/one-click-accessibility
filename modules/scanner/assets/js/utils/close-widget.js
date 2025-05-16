import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';

export const closeWidget = (widget) => {
	const isRTL = Boolean(window.ea11yScannerData?.isRTL);
	removeExistingFocus();
	widget.remove();
	document.body.style.removeProperty(isRTL ? 'margin-left' : 'margin-right');
	document.body.prepend(window.ea11yScannerData.adminBar);
};
