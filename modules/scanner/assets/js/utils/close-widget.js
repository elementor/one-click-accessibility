import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import {
	clearRemovedNodes,
	getRemovedNodes,
	restorePublicDomChanges,
} from '@ea11y-apps/scanner/utils/public-dom-normalizer';

export const closeWidget = (widget) => {
	removeExistingFocus();
	widget.remove();
	const url = new URL(window.location.href);
	url.searchParams.delete('open-ea11y-assistant');
	url.searchParams.delete('open-ea11y-manage');
	url.searchParams.delete('open-ea11y-assistant-src');
	document.body.style.removeProperty('margin-inline-end');
	document.body.prepend(window.ea11yScannerData.adminBar);
	restorePublicDomChanges(getRemovedNodes());
	clearRemovedNodes();
	window.history.replaceState({}, '', url.toString());
};
