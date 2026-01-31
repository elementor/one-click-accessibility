import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';

export const closeWidget = (widget) => {
	removeExistingFocus();
	widget.remove();
	const url = new URL(window.location.href);
	url.searchParams.delete('open-ea11y-assistant');
	url.searchParams.delete('open-ea11y-manage');
	url.searchParams.delete('open-ea11y-assistant-src');
	document.body.style.removeProperty('margin-inline-end');
	document.body.prepend(window.ea11yScannerData.adminBar);
	window.history.replaceState({}, '', url.toString());
};
