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
} from '@ea11y/components';
import {
	useNotificationSettings,
	useSettings,
	useSavedSettings,
} from '@ea11y/hooks';
import { Sidebar } from '@ea11y/layouts';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import PageContent from './page-content';

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

const App = () => {
	const { hasFinishedResolution, loading } = useSavedSettings();

	const { isConnected, isRTL, closePostConnectModal } =
		usePluginSettingsContext();
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { selectedMenu } = useSettings();

	useEffect(() => {
		mixpanelService.init().then(() => {
			mixpanelService.sendEvent('page_view', {
				page: 'Button',
			});
		});
	}, []);

	const selectedParent = MenuItems[selectedMenu?.parent];
	const selectedChild = selectedMenu?.child
		? selectedParent?.children[selectedMenu?.child]
		: null;

	return (
		<DirectionProvider rtl={isRTL}>
			<ThemeProvider colorScheme="light">
				{isConnected !== undefined && !isConnected && <ConnectModal />}
				{isConnected && !closePostConnectModal && <PostConnectModal />}

				<StyledGrid>
					<Sidebar />

					<StyledContainer>
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
