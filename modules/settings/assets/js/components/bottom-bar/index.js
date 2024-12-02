import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

export const BottomBar = () => {
	const { selectedMenu, widgetMenuSettings, hasChanges, setHasChanges } =
		useSettings();
	const { save } = useStorage();
	const { success, error } = useToastNotification();

	const saveSettings = () => {
		if (selectedMenu.parent === 'widget' && selectedMenu.child === 'menu') {
			try {
				save({
					a11y_widget_menu_settings: widgetMenuSettings,
				}).then(() => {
					success('Settings saved!');
					setHasChanges(false);
				});
			} catch (e) {
				error('Failed to save settings!');
			}
		}
	};
	return (
		<Box
			display="flex"
			justifyContent="end"
			p={2}
			width="100%"
			borderTop="1px solid rgba(0, 0, 0, 0.12)"
		>
			<Button
				variant="contained"
				color="info"
				onClick={saveSettings}
				disabled={!hasChanges}
			>
				{__('Save Changes', 'pojo-accessibility')}
			</Button>
		</Box>
	);
};
