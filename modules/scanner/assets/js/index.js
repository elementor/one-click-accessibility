import { createTheme, ThemeProvider } from '@elementor/ui/styles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import App from '@ea11y-apps/scanner/app';
import { ScannerWizardContextProvider } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { ROOT_ID, TOP_BAR_LINK } from '@ea11y-apps/scanner/utils/constants';
import { createRoot, Fragment, StrictMode } from '@wordpress/element';

TOP_BAR_LINK.addEventListener('click', (event) => {
	event.preventDefault();
	const rootNode = document.getElementById(ROOT_ID);

	if (rootNode) {
		closeWidget(rootNode);
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
	document.body.style.marginRight = '360px';
	document.body.appendChild(rootNode);

	const shadowContainer = rootNode.attachShadow({ mode: 'open' });
	const shadowRootElement = document.createElement('div');
	shadowContainer.appendChild(shadowRootElement);

	// Can't use the settings hook in the global scope so accessing directly
	const isDevelopment = window?.ea11ySettingsData?.isDevelopment;
	const AppWrapper = Boolean(isDevelopment) ? StrictMode : Fragment;
	const cache = createCache({
		key: 'css',
		prepend: true,
		container: shadowContainer,
	});

	const shadowTheme = createTheme({
		cssVariables: {
			rootSelector: ':host',
			colorSchemeSelector: 'class',
		},
		components: {
			MuiPopover: {
				defaultProps: {
					container: shadowRootElement,
				},
			},
			MuiPopper: {
				defaultProps: {
					container: shadowRootElement,
				},
			},
			MuiModal: {
				defaultProps: {
					container: shadowRootElement,
				},
			},
			MuiTooltip: {
				defaultProps: {
					PopperProps: {
						container: shadowRootElement,
					},
					slotProps: {
						popper: {
							disablePortal: false, // in out theme, this defaults to true for the MuiPopper component
							container: shadowRootElement,
						},
					},
				},
			},
		},
	});

	createRoot(shadowRootElement).render(
		<AppWrapper>
			<CacheProvider value={cache}>
				<ThemeProvider
					theme={shadowTheme}
					colorScheme="light"
					colorSchemeNode={shadowRootElement}
				>
					<ScannerWizardContextProvider>
						<App />
					</ScannerWizardContextProvider>
				</ThemeProvider>
			</CacheProvider>
		</AppWrapper>,
	);
};
