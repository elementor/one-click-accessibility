import Box from '@elementor/ui/Box';
import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import Tab from '@elementor/ui/Tab';
import { FocusTrap } from 'focus-trap-react';
import Notifications from '@ea11y-apps/global/components/notifications';
import { useNotificationSettings } from '@ea11y-apps/global/hooks/use-notifications';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ErrorMessage } from '@ea11y-apps/scanner/components/error-message';
import Header from '@ea11y-apps/scanner/components/header';
import AppHeader from '@ea11y-apps/scanner/components/header/app-header';
import { Loader } from '@ea11y-apps/scanner/components/list-loader';
import { NotConnectedMessage } from '@ea11y-apps/scanner/components/not-connected-message';
import { QuotaMessage } from '@ea11y-apps/scanner/components/quota-message';
import { ResolvedMessage } from '@ea11y-apps/scanner/components/resolved-message';
import { BLOCKS, PAGE_QUOTA_LIMIT } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useTabsContext } from '@ea11y-apps/scanner/context/tabs-context';
import {
	AltTextLayout,
	ColorContrastLayout,
	HeadingStructureLayout,
	MainLayout,
	ManageAltTextLayout,
	ManageColorContrastLayout,
	ManageMainLayout,
	ManageManualLayout,
	ManualLayout,
} from '@ea11y-apps/scanner/layouts';
import {
	AppContainer,
	AppsTabPanel,
	AppsTabs,
} from '@ea11y-apps/scanner/styles/app.styles';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const App = () => {
	const { notificationMessage, notificationType } = useNotificationSettings();
	const {
		setOpenedBlock,
		violation,
		resolved,
		openedBlock,
		isError,
		isManage,
		quotaExceeded,
		loading,
	} = useScannerWizardContext();

	const { tabsProps, getTabProps, getTabPanelProps } = useTabsContext();

	const containerRef = useRef(null);

	const showResolvedMessage = Boolean(
		!isManage && ((resolved > 0 && violation === resolved) || violation === 0),
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

	const getMsgStateBlock = () => {
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

		return null;
	};

	const getIssuesBlock = () => {
		if (showResolvedMessage) {
			return <ResolvedMessage />;
		}
		switch (openedBlock) {
			case BLOCKS.main:
				return <MainLayout />;
			case BLOCKS.altText:
				return <AltTextLayout />;
			case BLOCKS.colorContrast:
				return <ColorContrastLayout />;
			case BLOCKS.headingStructure:
				return <HeadingStructureLayout />;
			default:
				return <ManualLayout />;
		}
	};

	const getManageBlock = () => {
		switch (openedBlock) {
			case BLOCKS.management:
				return <ManageMainLayout />;
			case BLOCKS.altText:
				return <ManageAltTextLayout />;
			case BLOCKS.colorContrast:
				return <ManageColorContrastLayout />;
			case BLOCKS.headingStructure:
				return <HeadingStructureLayout />;
			default:
				return <ManageManualLayout />;
		}
	};

	return (
		<FocusTrap
			containerElements={[containerRef.current]}
			focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}
		>
			<AppContainer elevation={6} ref={containerRef}>
				<ErrorBoundary fallback={<ErrorMessage />}>
					<AppHeader />
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<AppsTabs
							{...tabsProps}
							aria-label={__(
								'Accessibility Assistant Tabs',
								'pojo-accessibility',
							)}
							variant="fullWidth"
						>
							<Tab
								label={__('Issues found', 'pojo-accessibility')}
								{...getTabProps(BLOCKS.main)}
							/>
							<Tab
								label={__('Manage fixes', 'pojo-accessibility')}
								{...getTabProps(BLOCKS.management)}
							/>
						</AppsTabs>
					</Box>

					<Header />

					<AppsTabPanel {...getTabPanelProps(BLOCKS.main)}>
						{getMsgStateBlock() || getIssuesBlock()}
					</AppsTabPanel>
					<AppsTabPanel {...getTabPanelProps(BLOCKS.management)}>
						{getMsgStateBlock() || getManageBlock()}
					</AppsTabPanel>

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
