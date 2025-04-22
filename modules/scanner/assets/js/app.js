import Paper from '@elementor/ui/Paper';
import { styled } from '@elementor/ui/styles';
import { Notifications } from '@ea11y/components';
import { useNotificationSettings } from '@ea11y-apps/global/hooks/use-notifications';
import { Header } from '@ea11y-apps/scanner/components/header';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	AltTextLayout,
	MainLayout,
	ManualLayout,
} from '@ea11y-apps/scanner/layouts';
import { BLOCKS } from '@ea11y-apps/scanner/utils/constants';

const App = () => {
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { openedBlock } = useScannerWizardContext();

	const getBlock = () => {
		switch (openedBlock) {
			case BLOCKS.main:
				return <MainLayout />;
			case BLOCKS.altText:
				return <AltTextLayout />;
			default:
				return <ManualLayout />;
		}
	};

	return (
		<StyledPaper>
			<Header />
			{getBlock()}
			<Notifications message={notificationMessage} type={notificationType} />
		</StyledPaper>
	);
};

const StyledPaper = styled(Paper)`
	position: fixed;
	top: 32px;
	right: 0;
	width: 360px;
	height: calc(100vh - 32px);
	overflow-y: auto;
	z-index: 99999;
`;
export default App;
