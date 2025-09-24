import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import { FocusTrap } from 'focus-trap-react';
import { Notifications } from '@ea11y/components';
import { useNotificationSettings } from '@ea11y-apps/global/hooks/use-notifications';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ErrorMessage } from '@ea11y-apps/scanner/components/error-message';
import Header from '@ea11y-apps/scanner/components/header';
import { Loader } from '@ea11y-apps/scanner/components/list-loader';
import { NotConnectedMessage } from '@ea11y-apps/scanner/components/not-connected-message';
import { QuotaMessage } from '@ea11y-apps/scanner/components/quota-message';
import { ResolvedMessage } from '@ea11y-apps/scanner/components/resolved-message';
import { BLOCKS, PAGE_QUOTA_LIMIT } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	AltTextLayout,
	MainLayout,
	ManageMainLayout,
	ManualLayout,
	RemediationLayout,
} from '@ea11y-apps/scanner/layouts';
import { ColorContrastLayout } from '@ea11y-apps/scanner/layouts/color-contrast-layout';
import { HeadingStructureLayout } from '@ea11y-apps/scanner/layouts/heading-structure-layout';
import { AppContainer } from '@ea11y-apps/scanner/styles/app.styles';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useRef } from '@wordpress/element';

const App = () => {
	const { notificationMessage, notificationType } = useNotificationSettings();
	const {
		setOpenedBlock,
		violation,
		resolved,
		openedBlock,
		isManage,
		isError,
		quotaExceeded,
		loading,
	} = useScannerWizardContext();
	const containerRef = useRef(null);

	const showResolvedMessage = Boolean(
		(resolved > 0 && violation === resolved) || violation === 0,
	);

	useEffect(() => {
		if (window.ea11yScannerData?.planData?.user?.id && violation !== null) {
			void mixpanelService.init();
		}
	}, [window.ea11yScannerData?.planData?.user?.id, violation]);

	useEffect(() => {
		if (showResolvedMessage) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
	}, [showResolvedMessage]);

	useEffect(() => {
		if (!PAGE_QUOTA_LIMIT || quotaExceeded) {
			mixpanelService.sendEvent(mixpanelEvents.upgradeSuggestionViewed, {
				current_plan: window.ea11yScannerData?.planData?.plan?.name,
				action_trigger: 'scan_triggered',
				feature_locked: 'multi-page scan',
			});
		}
	}, [PAGE_QUOTA_LIMIT, quotaExceeded]);

	const getBlock = () => {
		if (!window.ea11yScannerData?.isConnected) {
			return <NotConnectedMessage />;
		}
		if (!PAGE_QUOTA_LIMIT || quotaExceeded) {
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
			case BLOCKS.management:
				return <ManageMainLayout />;
			case BLOCKS.altText:
				return <AltTextLayout />;
			case BLOCKS.colorContrast:
				return <ColorContrastLayout />;
			case BLOCKS.headingStructure:
				return <HeadingStructureLayout />;
			default:
				return isManage ? <RemediationLayout /> : <ManualLayout />;
		}
	};

	return (
		<FocusTrap
			containerElements={[containerRef.current]}
			focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}
		>
			<AppContainer elevation={6} ref={containerRef}>
				<ErrorBoundary fallback={<ErrorMessage />}>
					<Header />

					{showResolvedMessage && !isManage ? <ResolvedMessage /> : getBlock()}

					<Notifications
						message={notificationMessage}
						type={notificationType}
					/>
				</ErrorBoundary>
			</AppContainer>
		</FocusTrap>
	);
};

export default App;
