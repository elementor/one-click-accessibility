import { useSettings } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useCallback } from '@wordpress/element';

export const useToggleSetting = () => {
	const { setWidgetMenuSettings, setHasChanges } = useSettings();

	const toggleMenu = useCallback(
		(category, option) => {
			setWidgetMenuSettings((prevSettings) => {
				const newSettings = {
					...prevSettings,
					[option]: {
						...prevSettings[option],
						enabled: !prevSettings[option]?.enabled,
					},
				};

				setHasChanges(true);

				if (window?.ea11yWidget?.toolsSettings && window?.ea11yWidget?.widget) {
					window.ea11yWidget.toolsSettings = newSettings;
					window.ea11yWidget.widget.updateState();
				}

				if (prevSettings[option]) {
					mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
						state: prevSettings[option]?.enabled ? 'off' : 'on',
						type: option,
					});
				}

				return newSettings;
			});
		},
		[setWidgetMenuSettings, setHasChanges],
	);

	return { toggleMenu };
};
