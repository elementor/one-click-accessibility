import App from '@ea11y-apps/scanner/app';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import { createRoot, Fragment, StrictMode } from '@wordpress/element';

const topBarLink = document.querySelector('#wp-admin-bar-ea11y-remediation a');
const ROOT_ID = 'remediation-widget';

topBarLink.addEventListener('click', (event) => {
	event.preventDefault();
	const rootNode = document.getElementById(ROOT_ID);

	if (rootNode) {
		rootNode.remove();
	} else {
		scannerWizard
			.load()
			.then(() => {
				initApp();
			})
			.catch((e) => console.error(e));
	}
});

const initApp = () => {
	const rootNode = document.createElement('div');
	rootNode.id = ROOT_ID;
	document.body.appendChild(rootNode);

	// Can't use the settings hook in the global scope so accessing directly
	const isDevelopment = window?.ea11ySettingsData?.isDevelopment;
	const AppWrapper = Boolean(isDevelopment) ? StrictMode : Fragment;

	const root = createRoot(rootNode);

	root.render(
		<AppWrapper>
			<App />
		</AppWrapper>,
	);
};
