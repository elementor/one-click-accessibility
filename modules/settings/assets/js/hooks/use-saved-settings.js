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
		setAccessibilityStatementData,
		setShowAccessibilityGeneratedInfotip,
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
				setPlanData(result.data.ea11y_plan_data);
			}

			if (result?.data?.ea11y_accessibility_statement_data) {
				setAccessibilityStatementData(
					result.data.ea11y_accessibility_statement_data,
				);
			}
			if (result?.data?.ea11y_show_accessibility_generated_page_infotip) {
				setShowAccessibilityGeneratedInfotip(
					result.data.ea11y_show_accessibility_generated_page_infotip,
				);
			}
		}
	}, [result.hasFinishedResolution]);
};
