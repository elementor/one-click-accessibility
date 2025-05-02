import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import Paper from '@elementor/ui/Paper';
import { styled } from '@elementor/ui/styles';
import { Notifications } from '@ea11y/components';
import { useNotificationSettings } from '@ea11y-apps/global/hooks/use-notifications';
import { ErrorState } from '@ea11y-apps/scanner/components/error-state';
import { Header } from '@ea11y-apps/scanner/components/header';
import { Loader } from '@ea11y-apps/scanner/components/main-list/loader';
import { ResolvedState } from '@ea11y-apps/scanner/components/resolved-state';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	AltTextLayout,
	MainLayout,
	ManualLayout,
} from '@ea11y-apps/scanner/layouts';

const App = () => {
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { results, resolved, openedBlock, isError, loading } =
		useScannerWizardContext();
	const violation = results?.summary?.counts?.violation;

	const getBlock = () => {
		if (isError) {
			return <ErrorState />;
		}
		if (loading) {
			return <Loader />;
		}
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
			<ErrorBoundary fallback={<ErrorState />}>
				<Header />
				{violation !== resolved ? getBlock() : <ResolvedState isMain />}
				<Notifications message={notificationMessage} type={notificationType} />
			</ErrorBoundary>
		</StyledPaper>
	);
};

const StyledPaper = styled(Paper)`
	position: fixed;
	top: 32px;
	right: 0;
	width: 420px;
	height: calc(100vh - 32px);
	overflow-y: auto;
	z-index: 99999;
`;
export default App;
