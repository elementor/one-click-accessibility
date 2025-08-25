import clipboardCopy from 'clipboard-copy';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useState } from '@wordpress/element';

export const useCopyToClipboard = () => {
	const { openedBlock } = useScannerWizardContext();
	const [copied, setCopied] = useState(false);
	const copyToClipboard = (snippet, type, source) => async () => {
		await clipboardCopy(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 5000);
		mixpanelService.sendEvent(mixpanelEvents.copySnippetClicked, {
			snippet_type: type,
			snippet_content: snippet,
			category_name: openedBlock,
			source,
		});
	};
	return {
		copied,
		copyToClipboard,
	};
};
