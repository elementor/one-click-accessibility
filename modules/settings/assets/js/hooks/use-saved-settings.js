import { useSettings } from '@ea11y/hooks';
import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export const useSavedSettings = () => {
	const {
		setWidgetMenuSettings,
		setHideMinimumOptionAlert,
		setIconDesign,
		setIconPosition,
		setPlanData,
	} = useSettings();

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
			if (result?.data?.ea11y_widget_menu_settings) {
				setWidgetMenuSettings(result.data.ea11y_widget_menu_settings);
			}

			if (result?.data?.ea11y_widget_icon_settings?.style) {
				setIconDesign(result.data.ea11y_widget_icon_settings.style);
			}

			if (result?.data?.ea11y_hide_minimum_active_options_alert) {
				setHideMinimumOptionAlert(
					result.data.ea11y_hide_minimum_active_options_alert,
				);
			}

			if (result?.data?.ea11y_widget_icon_settings?.position) {
				setIconPosition(result.data.ea11y_widget_icon_settings.position);
			}

			if (result?.data?.ea11y_plan_data) {
				setPlanData(JSON.parse(result.data.ea11y_plan_data));
			}
		}
	}, [result.hasFinishedResolution]);
};
