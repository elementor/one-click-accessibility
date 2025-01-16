import mixpanel from 'mixpanel-browser';

export const SHARE_USAGE_DATA = 'share_usage_data';

const init = () => {
	const { ea11ySettingsData } = window;

	if (
		!ea11ySettingsData.mixpanelToken ||
		!ea11ySettingsData?.planData?.scopes?.includes(SHARE_USAGE_DATA)
	) {
		return;
	}

	mixpanel.init(ea11ySettingsData.mixpanelToken, {
		debug: false,
		track_pageview: false,
		persistence: 'localStorage',
	});
};

const sendEvent = (name, event) => {
	const { ea11ySettingsData } = window;
	const plan = ea11ySettingsData?.planData?.plan;
	if (mixpanel.__loaded) {
		mixpanel.track(name, {
			...event,
			productName: 'app_access',
			subscription: {
				subscriptionId: plan?.subscription_id,
				name: plan?.name,
				status: plan?.status,
			},
			userData: {
				id: ea11ySettingsData?.clientId,
				email: ea11ySettingsData?.planData?.user?.email,
			},
		});
	}
};

export const mixpanelService = {
	init,
	sendEvent,
};
