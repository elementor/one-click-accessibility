import { createOneMigrationTracking } from './mixpanel-props/migration';

const SHARE_USAGE_DATA = 'share_usage_data';
const MIXPANEL_TOKEN = '150605b3b9f979922f2ac5a52e2dcfe9';
const MIXPANEL_HOST = 'https://api-eu.mixpanel.com';
const APP_INSTANCE_KEY = 'app_access';

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

	// Lazy load mixpanel
	if (!mixpanel) {
		const mixpanelModule = await import(
			/* webpackChunkName: "chunk-mixpanel-browser" */ 'mixpanel-browser'
		);
		mixpanel = mixpanelModule.default;
	}

	const pluginEnv = ea11ySettingsData?.pluginEnv || ea11yScannerData?.pluginEnv;
	const pluginVersion =
		ea11ySettingsData?.pluginVersion || ea11yScannerData?.pluginVersion;

	await mixpanel.init(MIXPANEL_TOKEN, {
		api_host: MIXPANEL_HOST,
		debug: pluginEnv === 'dev',
		track_pageview: false,
		persistence: 'localStorage',
		persistence_name: APP_INSTANCE_KEY,
		record_sessions_percent: 2,
		record_heatmap_data: true,
	});

	mixpanel.register({
		productName: APP_INSTANCE_KEY,
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

const oneMigration = createOneMigrationTracking(sendEvent);

export const mixpanelService = {
	init,
	sendEvent,
	oneMigration,
};
