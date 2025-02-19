import { useSettings } from '@ea11y/hooks';
import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

export const useSavedSettings = () => {
	const [isLoading, setIsLoading] = useState(true);

	const {
		setWidgetMenuSettings,
		setHideMinimumOptionAlert,
		setIconDesign,
		setIconPosition,
		setPlanData,
		setAccessibilityStatementData,
		setShowAccessibilityGeneratedInfotip,
		setSkipToContentSettings,
	} = useSettings();

	const result = useSelect((select) => {
		return {
			data: select(coreDataStore).getEntityRecord('root', 'site'),
			isResolving: select(coreDataStore).isResolving('getEntityRecord', [
				'root',
				'site',
			]),
			hasFinishedResolution: select(coreDataStore).hasFinishedResolution(
				'getEntityRecord',
				['root', 'site'],
			),
		};
	}, []);

	useEffect(() => {
		setIsLoading(result.isResolving);
	}, [result]);

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

			if (result?.data?.ea11y_skip_to_content_settings) {
				setSkipToContentSettings(result?.data?.ea11y_skip_to_content_settings);
			}
		}
	}, [result.hasFinishedResolution]);

	return {
		loading: isLoading,
		hasFinishedResolution: result.hasFinishedResolution,
	};
};
