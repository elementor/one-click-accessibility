import { createTheme, ThemeProvider } from '@elementor/ui/styles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { NotificationsProvider } from '@ea11y-apps/global/hooks/use-notifications';
import App from '@ea11y-apps/scanner/app';
import { ROOT_ID, TOP_BAR_LINK } from '@ea11y-apps/scanner/constants';
import { ScannerWizardContextProvider } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { createRoot, Fragment, StrictMode } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

TOP_BAR_LINK.addEventListener('click', (event) => {
	event.preventDefault();
	const rootNode = document.getElementById(ROOT_ID);

	if (rootNode) {
		closeWidget(rootNode);
	} else {
		initApp();
	}
});

const initApp = () => {
	const rootNode = document.createElement('aside');
	rootNode.id = ROOT_ID;
	rootNode.setAttribute(
		'aria-label',
		__('Accessibility Scanner', 'pojo-accessibility'),
	);
	document.body.style.marginRight = '420px';
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
					<NotificationsProvider>
						<ScannerWizardContextProvider>
							<App />
						</ScannerWizardContextProvider>
					</NotificationsProvider>
				</ThemeProvider>
			</CacheProvider>
		</AppWrapper>,
	);
};
