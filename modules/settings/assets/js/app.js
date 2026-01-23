import '../css/style.css';
import {
	ElementorOneAssetsProvider,
	ElementorOneHeader,
} from '@elementor/elementor-one-assets';
import Box from '@elementor/ui/Box';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import Grid from '@elementor/ui/Grid';
import { styled, ThemeProvider } from '@elementor/ui/styles';
import {
	ConnectModal,
	GetStartedModal,
	MenuItems,
	OnboardingModal,
	PostConnectModal,
	UrlMismatchModal,
} from '@ea11y/components';
import {
	useNotificationSettings,
	useSavedSettings,
	useSettings,
} from '@ea11y/hooks';
import { QuotaNotices, Sidebar } from '@ea11y/layouts';
import Notifications from '@ea11y-apps/global/components/notifications';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import PageContent from './page-content';

const App = () => {
	const { ea11ySettingsData } = window;
	const { hasFinishedResolution, loading } = useSavedSettings();

	const {
		isConnected,
		isRTL,
		closePostConnectModal,
		isUrlMismatch,
		refreshPluginSettings,
	} = usePluginSettingsContext();
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { selectedMenu } = useSettings();

	useEffect(() => {
		if (ea11ySettingsData?.planData?.user?.id) {
			mixpanelService.init().then(() => {
				mixpanelService.sendEvent(mixpanelEvents.pageView, {
					page: 'Button',
				});
			});
		}
	}, [ea11ySettingsData?.planData?.user?.id]);

	const selectedParent = MenuItems[selectedMenu?.parent];
	const selectedChild = selectedMenu?.child
		? selectedParent?.children[selectedMenu?.child]
		: null;

	return (
		<DirectionProvider rtl={isRTL}>
			<ThemeProvider colorScheme="light">
				<ElementorOneAssetsProvider
					env={
						ea11ySettingsData?.pluginEnv === 'stg' ? 'staging' : 'production'
					}
				>
					<ElementorOneHeader
						appSettings={{
							slug: 'ally', // Intentionally different than the plugin slug.
							version: ea11ySettingsData?.pluginVersion,
						}}
						isWithinWpAdmin
						onDisconnect={refreshPluginSettings}
					/>

					{isConnected !== undefined && !isUrlMismatch && !isConnected && (
						<ConnectModal />
					)}
					{isConnected && !closePostConnectModal && <PostConnectModal />}
					{isUrlMismatch && <UrlMismatchModal />}
					<OnboardingModal />
					<GetStartedModal />

					<StyledGrid>
						<Sidebar />

						<StyledContainer
							role="main"
							aria-label={__('Main Content', 'pojo-accessibility')}
						>
							<QuotaNotices />
							<PageContent
								// Looks the best if we have both checks
								isLoading={!hasFinishedResolution || loading}
								page={
									selectedChild ? selectedChild?.page : selectedParent?.page
								}
							/>
						</StyledContainer>
					</StyledGrid>

					<Notifications
						message={notificationMessage}
						type={notificationType}
					/>
				</ElementorOneAssetsProvider>
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;

const StyledContainer = styled(Box)`
	width: 100%;

	display: flex;
	flex-direction: column;
	justify-content: start;
`;

const StyledGrid = styled(Grid)`
	height: calc(100% - 48px);

	display: flex;
	flex-direction: row;
`;
