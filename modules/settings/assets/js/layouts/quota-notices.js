import Alert from '@elementor/ui/Alert';
import AlertAction from '@elementor/ui/AlertAction';
import AlertTitle from '@elementor/ui/AlertTitle';
import { useSettings } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { UPGRADE_LINK } from '../constants/index';
import { openLink } from '../utils';

const QuotaNotices = () => {
	const { planUsage } = useSettings();

	/**
	 * Handle the click on the upgrade button.
	 * @param {string} type
	 */
	const handleUpgradeClick = (type) => {
		mixpanelService.sendEvent('upgrade_button_clicked', {
			feature: 'quota notice ' + type,
			component: 'upgrade button',
		});
		openLink(UPGRADE_LINK);
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

	if (planUsage >= 80 && planUsage <= 99) {
		sendQuotaNoticeTriggeredEvent('80%');
		return (
			<Alert
				severity="warning"
				square
				action={
					<AlertAction
						variant="outlined"
						onClick={() => handleUpgradeClick('80')}
					>
						{__('Upgrade', 'pojo-accessibility')}
					</AlertAction>
				}
			>
				<AlertTitle>
					{__("You've used more than 80% of the quota", 'pojo-accessibility')}
				</AlertTitle>
			</Alert>
		);
	}

	if (planUsage === 100) {
		sendQuotaNoticeTriggeredEvent('100%');
		return (
			<Alert
				severity="error"
				square
				action={
					<AlertAction
						variant="outlined"
						onClick={() => handleUpgradeClick('100')}
					>
						{__('Upgrade', 'pojo-accessibility')}
					</AlertAction>
				}
			>
				<AlertTitle>
					{__("You've used 100% of the quota.", 'pojo-accessibility')}
				</AlertTitle>
			</Alert>
		);
	}
};

export default QuotaNotices;
