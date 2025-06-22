import clipboardCopy from 'clipboard-copy';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';

export const useCopyToClipboard = () => {
	const [copied, setCopied] = useState(false);
	const copyToClipboard = (snippet, type) => async () => {
		await clipboardCopy(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 5000);
		mixpanelService.sendEvent(mixpanelEvents.copySnippetClicked, {
			snippet_type: type,
			snippet_content: snippet,
		});
	};
	return {
		copied,
		copyToClipboard,
	};
};
