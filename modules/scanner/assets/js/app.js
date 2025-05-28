import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import { Notifications } from '@ea11y/components';
import { useNotificationSettings } from '@ea11y-apps/global/hooks/use-notifications';
import { ErrorMessage } from '@ea11y-apps/scanner/components/error-message';
import { Header } from '@ea11y-apps/scanner/components/header';
import { Loader } from '@ea11y-apps/scanner/components/main-list/loader';
import { QuotaMessage } from '@ea11y-apps/scanner/components/quota-message';
import { ResolvedMessage } from '@ea11y-apps/scanner/components/resolved-message';
import { BLOCKS, PAGE_QUOTA_LIMIT } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	AltTextLayout,
	MainLayout,
	ManualLayout,
} from '@ea11y-apps/scanner/layouts';
import { StyledPaper } from '@ea11y-apps/scanner/styles/app.styles';

const App = () => {
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { violation, resolved, openedBlock, isError, loading } =
		useScannerWizardContext();

	const showResolvedMessage = violation && resolved && violation === resolved;

	const getBlock = () => {
		if (!PAGE_QUOTA_LIMIT) {
			return <QuotaMessage />;
		}
		if (isError) {
			return <ErrorMessage />;
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
			<ErrorBoundary fallback={<ErrorMessage />}>
				<Header />
				{showResolvedMessage ? <ResolvedMessage isMain /> : getBlock()}
				<Notifications message={notificationMessage} type={notificationType} />
			</ErrorBoundary>
		</StyledPaper>
	);
};

export default App;
