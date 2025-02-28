import Alert from '@elementor/ui/Alert';
import AlertAction from '@elementor/ui/AlertAction';
import AlertTitle from '@elementor/ui/AlertTitle';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { UPGRADE_LINK } from '../constants/index';
import { openLink } from '../utils';

const QuotaNotices = () => {
	const { planUsage } = useSettings();

	if (planUsage < 80) {
		return null;
	}

	if (planUsage >= 80 && planUsage <= 95) {
		return (
			<Alert
				severity="warning"
				square
				action={
					<AlertAction
						variant="outlined"
						onClick={() => openLink(UPGRADE_LINK)}
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

	if (planUsage > 95) {
		return (
			<Alert
				severity="error"
				square
				action={
					<AlertAction
						variant="outlined"
						onClick={() => openLink(UPGRADE_LINK)}
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
