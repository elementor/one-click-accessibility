import mixpanel from 'mixpanel-browser';

const SHARE_USAGE_DATA = 'share_usage_data';
const MIXPANEL_TOKEN = '150605b3b9f979922f2ac5a52e2dcfe9';

const init = async () => {
	const { ea11ySettingsData, ea11yScannerData } = window;
	const planData = ea11ySettingsData?.planData || ea11yScannerData?.planData;
	const planScope = ea11ySettingsData?.planScope || ea11yScannerData?.planScope;
	const plan = planData?.plan;

	if (
		!planData?.scopes?.includes(SHARE_USAGE_DATA) &&
		!planScope?.includes(SHARE_USAGE_DATA)
	) {
		return;
	}

	const pluginEnv = ea11ySettingsData?.pluginEnv || ea11yScannerData?.pluginEnv;

	await mixpanel.init(MIXPANEL_TOKEN, {
		debug: pluginEnv === 'dev',
		track_pageview: false,
		persistence: 'localStorage',
		record_sessions_percent: 50,
	});

	mixpanel.register({
		productName: 'app_access',
		appType: 'Apps',
		environment: pluginEnv,
		is_trial: Boolean(plan?.name?.toLowerCase().includes('free')),
		plan_type: plan?.name,
		subscription_id: plan?.subscription_id,
	});

	mixpanel.identify(planData?.user?.id);

	const userData = {
		$email: planData?.user?.email,
		$user_id: planData?.user?.id,
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
