import Alert from '@elementor/ui/Alert';
import AlertAction from '@elementor/ui/AlertAction';
import AlertTitle from '@elementor/ui/AlertTitle';
import { styled } from '@elementor/ui/styles';
import { useSettings, useStorage } from '@ea11y/hooks';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { openLink } from '../utils';

const QuotaNotices = () => {
	const {
		planUsage,
		planData,
		dismissedQuotaNotices,
		setDismissedQuotaNotices,
	} = useSettings();
	const { save } = useStorage();
	const isFree = planData?.plan?.name === 'Free';

	/**
	 * Handle the click on the upgrade button.
	 * @param {string} type
	 */
	const handleUpgradeClick = (type) => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			feature: 'quota notice ' + type,
			component: 'upgrade button',
		});
		openLink(GOLINKS[`UPGRADE_${type}`]);
	};

	/**
	 * Send an event to Mixpanel when the quota notice is triggered.
	 * @param {string} type
	 */
	const sendQuotaNoticeTriggeredEvent = (type) => {
		mixpanelService.sendEvent('quota_notice_triggered', {
			quota_level: type,
		});
	};

	/**
	 * Handle closing/dismissing a quota notice.
	 * @param {string} noticeId - The notice ID (e.g., 'quota-banner-80')
	 */
	const handleCloseNotice = async (noticeId) => {
		const updatedDismissed = dismissedQuotaNotices.includes(noticeId)
			? dismissedQuotaNotices
			: [...dismissedQuotaNotices, noticeId];

		setDismissedQuotaNotices(updatedDismissed);

		try {
			await save({
				ea11y_dismissed_quota_notices: updatedDismissed,
			});
		} catch (error) {
			console.error('Failed to save dismissed notice:', error);
		}
	};

	if (planUsage.aiCredits < 80 && planUsage.scannedPages < 80) {
		return null;
	}

	if (
		(planUsage.aiCredits >= 80 && planUsage.aiCredits < 95 && !isFree) ||
		(planUsage.scannedPages >= 80 && planUsage.scannedPages < 95 && !isFree)
	) {
		const noticeId = 'quota-banner-80';
		if (dismissedQuotaNotices.includes(noticeId)) {
			return null;
		}

		sendQuotaNoticeTriggeredEvent('80%');
		return (
			<StyledAlert
				severity="warning"
				square
				onClose={() => handleCloseNotice(noticeId)}
			>
				<AlertTitle>
					{__(
						"You've reached 80% of your monthly plan usage",
						'pojo-accessibility',
					)}
				</AlertTitle>
				{__(
					'Upgrade now to increase your limit and ensure all accessibility features stay fully available for every visitor.',
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('80')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</StyledAlert>
		);
	}

	if (
		(planUsage.aiCredits >= 95 && planUsage.aiCredits < 100 && !isFree) ||
		(planUsage.scannedPages >= 95 && planUsage.scannedPages < 100 && !isFree)
	) {
		const noticeId = 'quota-banner-95';
		if (dismissedQuotaNotices.includes(noticeId)) {
			return null;
		}

		sendQuotaNoticeTriggeredEvent('95%');
		return (
			<StyledAlert
				severity="error"
				square
				onClose={() => handleCloseNotice(noticeId)}
			>
				<AlertTitle>
					{__('Only 5% of your monthly plan usage left', 'pojo-accessibility')}
				</AlertTitle>
				{__(
					'Upgrade now to increase your limit and keep all accessibility features running smoothly for every visitor.',
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('95')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</StyledAlert>
		);
	}

	if (
		(planUsage.aiCredits === 100 || planUsage.scannedPages === 100) &&
		!isFree
	) {
		const noticeId = 'quota-banner-100';
		if (dismissedQuotaNotices.includes(noticeId)) {
			return null;
		}

		sendQuotaNoticeTriggeredEvent('100%');
		return (
			<StyledAlert
				severity="error"
				square
				onClose={() => handleCloseNotice(noticeId)}
			>
				<AlertTitle>
					{__("You've reached your monthly plan usage", 'pojo-accessibility')}
				</AlertTitle>
				{__(
					'Upgrade now to raise your limit and maintain complete access to all accessibility features for every visitor.',
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('100')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</StyledAlert>
		);
	}

	if (planUsage.scannedPages === 100 && isFree) {
		const noticeId = 'quota-banner-100-free';

		if (dismissedQuotaNotices.includes(noticeId)) {
			return null;
		}

		sendQuotaNoticeTriggeredEvent('100%');
		return (
			<StyledAlert
				severity="error"
				square
				onClose={() => handleCloseNotice(noticeId)}
			>
				<AlertTitle>
					{__("You've reached your free plan limit", 'pojo-accessibility')}
				</AlertTitle>
				{__(
					'Upgrade to scan more pages, unlock AI fixes, and access all accessibility features.',
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('100')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</StyledAlert>
		);
	}
};

export default QuotaNotices;

const StyledAlert = styled(Alert)`
	.MuiAlert-content div {
		display: flex;
		flex-direction: column;
		align-items: start;
	}
`;
