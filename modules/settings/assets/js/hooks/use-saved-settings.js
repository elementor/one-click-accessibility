import { useSettings } from '@ea11y/hooks';
import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export const useSavedSettings = () => {
	const { setIconDesign, setIconPosition } = useSettings();

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
			if (result?.data?.a11y_widget_icon_settings?.style) {
				setIconDesign(result.data.a11y_widget_icon_settings.style);
			}

			if (result?.data?.a11y_widget_icon_settings?.position) {
				setIconPosition(result.data.a11y_widget_icon_settings.position);
			}
		}
	}, [result.hasFinishedResolution]);
};
