import { useSettings } from '@ea11y/hooks';
import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export const useSavedSettings = () => {
	const { setWidgetMenuSettings, setHideMinimumOptionAlert } = useSettings();

	const result = useSelect((select) => {
		return {
			data: select(coreDataStore).getEntityRecord('root', 'site'),
			hasFinishedResolution: select(coreDataStore).hasFinishedResolution(
				'getEntityRecord',
				['root', 'site'],
			),
		};
	}, []);

	useEffect(() => {
		if (result.hasFinishedResolution) {
			if (result?.data?.a11y_widget_menu_settings) {
				setWidgetMenuSettings(result.data.a11y_widget_menu_settings);
			}

			if (result?.data?.a11y_hide_minimum_active_options_alert) {
				setHideMinimumOptionAlert(
					result.data.a11y_hide_minimum_active_options_alert,
				);
			}
		}
	}, [result.hasFinishedResolution]);
};
