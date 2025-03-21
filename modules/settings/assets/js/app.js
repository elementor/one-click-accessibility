import '../css/style.css';
import Box from '@elementor/ui/Box';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import Grid from '@elementor/ui/Grid';
import { styled, ThemeProvider } from '@elementor/ui/styles';
import {
	ConnectModal,
	Notifications,
	MenuItems,
	PostConnectModal,
	UrlMismatchModal,
} from '@ea11y/components';
import {
	useNotificationSettings,
	useSettings,
	useSavedSettings,
} from '@ea11y/hooks';
import { QuotaNotices, Sidebar } from '@ea11y/layouts';
import { eventNames, mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import PageContent from './page-content';

const App = () => {
	const { hasFinishedResolution, loading } = useSavedSettings();

	const { isConnected, isRTL, closePostConnectModal, isUrlMismatch } =
		usePluginSettingsContext();
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { selectedMenu } = useSettings();

	useEffect(() => {
		if (window.ea11ySettingsData?.planData?.user?.id) {
			mixpanelService.init().then(() => {
				mixpanelService.sendEvent(eventNames.pageView, {
					page: 'Button',
				});
			});
		}
	}, [window.ea11ySettingsData?.planData?.user?.id]);

	const selectedParent = MenuItems[selectedMenu?.parent];
	const selectedChild = selectedMenu?.child
		? selectedParent?.children[selectedMenu?.child]
		: null;

	return (
		<DirectionProvider rtl={isRTL}>
			<ThemeProvider colorScheme="light">
				{isConnected !== undefined && !isUrlMismatch && !isConnected && (
					<ConnectModal />
				)}
				{isConnected && !closePostConnectModal && <PostConnectModal />}
				{isUrlMismatch && !isConnected && <UrlMismatchModal />}

				<StyledGrid>
					<Sidebar />

					<StyledContainer>
						<QuotaNotices />
						<PageContent
							// Looks the best if we have both checks
							isLoading={!hasFinishedResolution || loading}
							page={selectedChild ? selectedChild?.page : selectedParent?.page}
						/>
					</StyledContainer>
				</StyledGrid>

				<Notifications message={notificationMessage} type={notificationType} />
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
	height: 100%;

	display: flex;
	flex-direction: row;
`;
