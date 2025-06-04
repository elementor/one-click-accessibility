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

export const eventNames = {
	pageView: 'page_view',
	helpButtonClicked: 'help_button_clicked',
	toggleClicked: 'toggle_clicked',
	positionButtonClicked: 'position_button_clicked',
	saveButtonClicked: 'save_button_clicked',
	colorChanged: 'color_changed',
	iconTypeSelected: 'icon_type_selected',
	sizeTypeClicked: 'size_type_clicked',
	menuButtonClicked: 'menu_button_clicked',
	handleUnitChanged: 'handle_unit_changed',
	handleValueChanged: 'handle_value_changed',
	handleDirectionChanged: 'handle_direction_changed',
	connectSuccess: 'connect_success',
	fieldContentUpdated: 'field_content_updated',
	statementPageCreated: 'statement_page_created',
	statementPageSelected: 'statement_page_selected',
	statementFlowSelected: 'statement_flow_selected',
	upgradeButtonClicked: 'upgrade_button_clicked',
	popupButtonClicked: 'popup_button_clicked',
	filterSelected: 'filter_selected',
	upgradeTooltipTriggered: 'upgrade_tooltip_triggered',
	radiusChanged: 'radius_changed',
	addCustomIconClicked: 'add_custom_icon_clicked',
	updateCustomIconClicked: 'update_custom_icon_clicked',
	customIconAdded: 'custom_icon_added',
	customIconUpdated: 'custom_icon_updated',

	// Accessibility assistant
	scanTriggered: 'scan_triggered',
	categoryClicked: 'category_clicked',
	issueSelected: 'issue_selected',
	fixWithAiButtonClicked: 'fix_with_ai_button_clicked',
	markAsDecorativeSelected: 'mark_as_decorative_selected',
	resolveButtonClicked: 'resolve_button_clicked',
	navigationImageClicked: 'navigation_image_clicked',
	aiSuggestionAccepted: 'ai_suggestion_accepted',
	markAsResolveClicked: 'mark_as_resolve_clicked',
	issueSkipped: 'issue_skipped',
	upgradeSuggestionViewed: 'upgrade_suggestion_viewed',
	applyFixButtonClicked: 'apply_fix_button_clicked',
	copySnippetClicked: 'copy_snippet_clicked',
};
