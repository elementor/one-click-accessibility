import Alert from '@elementor/ui/Alert';
import AlertAction from '@elementor/ui/AlertAction';
import AlertTitle from '@elementor/ui/AlertTitle';
import { useSettings } from '@ea11y/hooks';
import { eventNames, mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { GOLINKS } from '../constants/index';
import { openLink } from '../utils';

const QuotaNotices = () => {
	const { planUsage } = useSettings();

	/**
	 * Handle the click on the upgrade button.
	 * @param {string} type
	 */
	const handleUpgradeClick = (type) => {
		mixpanelService.sendEvent(eventNames.upgradeButtonClicked, {
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

	if (planUsage < 80) {
		return null;
	}

	if (planUsage >= 80 && planUsage < 95) {
		sendQuotaNoticeTriggeredEvent('80%');
		return (
			<Alert severity="warning" square>
				<AlertTitle>
					{__(
						'You’ve reached 80% of your widget monthly visits',
						'pojo-accessibility',
					)}
				</AlertTitle>
				{__(
					'Upgrade now to increase your plans monthly widget visits limit and ensure all accessibility features remain available for every visitor.',
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('80')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</Alert>
		);
	}

	if (planUsage >= 95 && planUsage < 100) {
		sendQuotaNoticeTriggeredEvent('95%');
		return (
			<Alert severity="error" square>
				<AlertTitle>
					{__(
						'Only 5% of your monthly widget visits are left',
						'pojo-accessibility',
					)}
				</AlertTitle>
				{__(
					"Upgrade now to increase your plan's monthly widget visits limit and ensure all accessibility features remain available for every visitor.",
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('95')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</Alert>
		);
	}

	if (planUsage === 100) {
		sendQuotaNoticeTriggeredEvent('100%');
		return (
			<Alert severity="error" square>
				<AlertTitle>
					{__(
						"You've reached your widget monthly visits",
						'pojo-accessibility',
					)}
				</AlertTitle>
				{__(
					"Upgrade now to increase your plan's monthly widget visits limit and ensure all accessibility features remain available for every visitor.",
					'pojo-accessibility',
				)}
				<AlertAction
					variant="outlined"
					onClick={() => handleUpgradeClick('100')}
					sx={{ marginTop: 1 }}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</AlertAction>
			</Alert>
		);
	}
};

export default QuotaNotices;
