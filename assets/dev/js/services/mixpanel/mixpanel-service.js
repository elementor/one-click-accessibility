const SHARE_USAGE_DATA = 'share_usage_data';
const MIXPANEL_TOKEN = '150605b3b9f979922f2ac5a52e2dcfe9';

// Store the mixpanel instance once loaded
let mixpanel = null;

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

	// Lazy load mixpanel-browser only when analytics is enabled
	if (!mixpanel) {
		const mixpanelModule = await import('mixpanel-browser');
		mixpanel = mixpanelModule.default;
	}

	const pluginEnv = ea11ySettingsData?.pluginEnv || ea11yScannerData?.pluginEnv;
	const pluginVersion =
		ea11ySettingsData?.pluginVersion || ea11yScannerData?.pluginVersion;

	await mixpanel.init(MIXPANEL_TOKEN, {
		debug: pluginEnv === 'dev',
		track_pageview: false,
		persistence: 'localStorage',
	});

	mixpanel.register({
		productName: 'app_access',
		appType: 'Apps',
		version: pluginVersion,
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
		$scanned_urls: `${planData?.scannedPages?.used || 0}/${planData?.scannedPages?.allowed || 0}`,
	};

	mixpanel.people?.set_once(userData);
};

const sendEvent = (name, event) => {
	if (mixpanel?.__loaded) {
		mixpanel.track(name, event);
	}
};

export const mixpanelService = {
	init,
	sendEvent,
};
