import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import CardContent from '@elementor/ui/CardContent';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { EmptyManageMessage } from '@ea11y-apps/scanner/components/empty-manage-message';
import ManageRemediationList from '@ea11y-apps/scanner/components/manage-remediation-list';
import {
	ManageGlobalRemediationControl,
	ManageRemediationControl,
} from '@ea11y-apps/scanner/components/manage-remediation-main-controls';
import {
	HIDE_UPGRADE_KEY,
	IS_PRO_PLAN,
	UPGRADE_URL,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageMainLayout = () => {
	const { remediations, globalRemediations } = useScannerWizardContext();
	const [showUpgradeAlert, setShowUpgradeAlert] = useState(true);

	const hideUpgradeAlert = () => {
		window.localStorage.setItem(HIDE_UPGRADE_KEY, Date.now().toString());
		setShowUpgradeAlert(false);
	};

	const isShowUpgradeAlert = () => {
		const time = window.localStorage.getItem(HIDE_UPGRADE_KEY);
		return !time && showUpgradeAlert;
	};

	const onUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			feature_locked: 'global_banner',
		});
	};

	const showPromo =
		(remediations.length > 0 || globalRemediations.length > 0) &&
		!IS_PRO_PLAN &&
		isShowUpgradeAlert();

	return (
		<StyledContent>
			{remediations.length > 0 && (
				<>
					<ManageHeader>
						<Typography variant="body2" color="text.tertiary">
							{__('Fixes on this page', 'pojo-accessibility')}
						</Typography>
						<ManageRemediationControl />
					</ManageHeader>
					<ManageRemediationList />
				</>
			)}

			{globalRemediations.length > 0 && (
				<>
					<ManageHeader sx={{ mt: 2 }}>
						<Typography variant="body2" color="text.tertiary">
							{__('Cross-page fixes', 'pojo-accessibility')}
						</Typography>
						<ManageGlobalRemediationControl />
					</ManageHeader>
					<ManageRemediationList global />
				</>
			)}

			{remediations.length === 0 && globalRemediations.length === 0 && (
				<EmptyManageMessage />
			)}
			{showPromo && (
				<Alert
					icon={<CrownFilled color="promotion" />}
					color="error"
					onClose={hideUpgradeAlert}
					sx={{ mt: 2 }}
				>
					<Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
						{__(
							'Resolve these issues on all of your scanned pages with a click.',
							'pojo-accessibility',
						)}
					</Typography>
					<Button
						size="small"
						color="promotion"
						variant="contained"
						href={UPGRADE_URL}
						target="_blank"
						rel="noreferrer"
						onClick={onUpgrade}
					>
						{__('Upgrade now', 'pojo-accessibility')}
					</Button>
				</Alert>
			)}
		</StyledContent>
	);
};

const ManageHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;
