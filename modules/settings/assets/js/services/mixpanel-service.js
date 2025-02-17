import mixpanel from 'mixpanel-browser';

const SHARE_USAGE_DATA = 'share_usage_data';
const MIXPANEL_TOKEN = '150605b3b9f979922f2ac5a52e2dcfe9';

const init = async () => {
	const { ea11ySettingsData } = window;
	const plan = ea11ySettingsData?.planData?.plan;

	if (!ea11ySettingsData?.planData?.scopes?.includes(SHARE_USAGE_DATA)) {
		return;
	}

	await mixpanel.init(MIXPANEL_TOKEN, {
		debug: ea11ySettingsData.pluginEnv === 'dev',
		track_pageview: false,
		persistence: 'localStorage',
		record_sessions_percent: 50,
	});

	mixpanel.register({
		productName: 'app_access',
		appType: 'Apps',
		environment: ea11ySettingsData.pluginEnv,
	});

	mixpanel.identify(ea11ySettingsData?.planData?.user?.id);

	const userData = {
		$email: ea11ySettingsData?.planData?.user?.email,
		$user_id: ea11ySettingsData?.planData?.user?.id,
		$subscription_type: plan?.name,
		$subscription_id: plan?.subscription_id,
		$subscription_status: plan?.status,
	};

	mixpanel.people?.set_once(userData);
};

const sendEvent = (name, event) => {
	if (mixpanel.__loaded) {
		mixpanel.track(name, event);
	}
};

export const mixpanelService = {
	init,
	sendEvent,
};
