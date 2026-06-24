import { mixpanelEvents } from '../mixpanel-events';

const MIGRATION_APP_TYPE = 'app_access';
const MIGRATION_APP_NAME = 'accessibility';

const ONE_MIGRATION_POPUP_DISPLAYED_PROPS = {
	app_type: MIGRATION_APP_TYPE,
	window_name: 'app_shell',
	interaction_type: 'impression',
	target_type: 'popup',
	target_name: 'one_migration',
	interaction_result: 'popup_displayed',
	target_location: 'app_page',
	interaction_desc:
		'One migration popup is shown to a user who has both an active One subscription and a standalone app subscription',
	metadata: [`app_name: ${MIGRATION_APP_NAME}`],
};

/**
 * @param {'move_to_one' | 'not_now'}                                        button
 * @param {'migration_success' | 'migration_failed' | 'migration_dismissed'} interactionResult
 * @param {'success' | 'failed' | null}                                      [status]
 * @param {string}                                                           [error]
 */
const buildOneMigrationButtonClickedProps = (
	button,
	interactionResult,
	status = null,
	error,
) => {
	const metadata = [`button: ${button}`, `status: ${status}`];

	if (error) {
		metadata.push(`error: ${error}`);
	}

	return {
		app_type: MIGRATION_APP_TYPE,
		window_name: 'app_shell',
		interaction_type: 'click',
		target_type: 'button',
		target_name: 'one_migration_action',
		interaction_result: interactionResult,
		target_location: 'one_migration_popup',
		interaction_desc:
			'User clicks Move to One or Not now on the One migration popup; if Move to One, result reflects API outcome',
		metadata,
	};
};

/**
 * @param {Function} sendEvent
 */
export const createOneMigrationTracking = (sendEvent) => ({
	trackPopupDisplayed: () => {
		sendEvent(
			mixpanelEvents.oneMigrationPopupDisplayed,
			ONE_MIGRATION_POPUP_DISPLAYED_PROPS,
		);
	},

	/**
	 * @param {'move_to_one' | 'not_now'}                                        button
	 * @param {'migration_success' | 'migration_failed' | 'migration_dismissed'} interactionResult
	 * @param {'success' | 'failed' | null}                                      [status]
	 * @param {string}                                                           [error]
	 */
	trackButtonClicked: (button, interactionResult, status = null, error) => {
		sendEvent(
			mixpanelEvents.oneMigrationButtonClicked,
			buildOneMigrationButtonClickedProps(
				button,
				interactionResult,
				status,
				error,
			),
		);
	},
});
