import { addQueryArgs } from '@wordpress/url';

const getDefaultSubscriptionId = () => {
	return window?.ea11ySettingsData?.planData?.subscription?.id;
};

export const getUpgradeLink = (url, subscriptionId = null) => {
	const subId = subscriptionId ?? getDefaultSubscriptionId();

	if (!subId) {
		return url;
	}

	return addQueryArgs(url, {
		subscription_id: subId,
	});
};
