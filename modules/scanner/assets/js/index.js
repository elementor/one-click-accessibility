import DirectionProvider from '@elementor/ui/DirectionProvider';
import { createTheme, ThemeProvider } from '@elementor/ui/styles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { NotificationsProvider } from '@ea11y-apps/global/hooks/use-notifications';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import App from '@ea11y-apps/scanner/app';
import {
	CLEAR_CACHE_LINK,
	isRTL,
	MANAGE_URL_PARAM,
	ROOT_ID,
	SCAN_LINK,
	SCANNER_URL_PARAM,
	TOP_BAR_LINK,
} from '@ea11y-apps/scanner/constants';
import { HeadingStructureContextProvider } from '@ea11y-apps/scanner/context/heading-structure-context';
import ScannerWizardContextProvider from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { TabsContextProvider } from '@ea11y-apps/scanner/context/tabs-context';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { createRoot, Fragment, StrictMode } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

window.addEventListener('load', () => {
	const params = new URLSearchParams(window.location.search);
	if (
		params.get(SCANNER_URL_PARAM) === '1' ||
		params.get(MANAGE_URL_PARAM) === '1'
	) {
		setTimeout(() => {
			initApp();
		}, 500);
	}
});

document.addEventListener('DOMContentLoaded', function () {
	document
		.querySelector(CLEAR_CACHE_LINK)
		?.addEventListener('click', async (event) => {
			event.stopPropagation();
			event.preventDefault();
			try {
				await APIScanner.clearCache();
				window.location.reload();
			} catch (e) {
				console.error(e);
			}
		});
	document
		.querySelectorAll(`${TOP_BAR_LINK}, ${SCAN_LINK}`)
		?.forEach((link) => {
			link.addEventListener('click', (event) => {
				event.preventDefault();
				const rootNode = document.getElementById(ROOT_ID);
				const url = new URL(window.location.href);
				url.searchParams.delete('open-ea11y-assistant-src');
				url.searchParams.append('open-ea11y-assistant-src', 'top_bar');
				history.replaceState(null, '', url);

				if (rootNode) {
					closeWidget(rootNode);
				} else {
					initApp();
				}
			});
		});
});

const initApp = () => {
	const adminBar = document.querySelector('#wpadminbar');
	window.ea11yScannerData = {
		...window.ea11yScannerData,
		adminBar,
	};
	adminBar.remove();

	const rootNode = document.createElement('aside');

	rootNode.id = ROOT_ID;
	rootNode.setAttribute(
		'aria-label',
		__('Accessibility Assistant', 'pojo-accessibility'),
	);

	if (isRTL) {
		rootNode.setAttribute('dir', 'rtl');
	}

	document.body.style[isRTL ? 'marginLeft' : 'marginRight'] = '425px';
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
		stylisPlugins: isRTL ? [prefixer, rtlPlugin] : [],
	});

	const theme = createTheme({
		direction: isRTL ? 'rtl' : 'ltr',
	});

	createRoot(shadowRootElement).render(
		<AppWrapper>
			<CacheProvider value={cache}>
				<DirectionProvider rtl={isRTL}>
					<ThemeProvider colorScheme="light" theme={theme}>
						<NotificationsProvider>
							<ScannerWizardContextProvider>
								<TabsContextProvider>
									<HeadingStructureContextProvider>
										<App />
									</HeadingStructureContextProvider>
								</TabsContextProvider>
							</ScannerWizardContextProvider>
						</NotificationsProvider>
					</ThemeProvider>
				</DirectionProvider>
			</CacheProvider>
		</AppWrapper>,
	);
};
