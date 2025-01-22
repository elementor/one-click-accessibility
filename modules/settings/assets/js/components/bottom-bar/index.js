import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';

const BottomBar = () => {
	const {
		selectedMenu,
		widgetMenuSettings,
		iconDesign,
		iconPosition,
		hasChanges,
		setHasChanges,
	} = useSettings();
	const { save } = useStorage();
	const { success, error } = useToastNotification();

	const saveSettings = async () => {
		let savedData = {};

		if (selectedMenu.parent === 'widget' && selectedMenu.child === 'menu') {
			savedData = {
				ea11y_widget_menu_settings: widgetMenuSettings,
			};
		} else if (
			selectedMenu.parent === 'widget' &&
			selectedMenu.child === 'iconSettings'
		) {
			savedData = {
				ea11y_widget_icon_settings: {
					style: iconDesign,
					position: iconPosition,
				},
			};
		}

		try {
			await save(savedData);

			success(__('Settings saved!', 'pojo-accessibility'));

			setHasChanges(false);

			mixpanelService.sendEvent('save_button_clicked', {
				savedData,
			});
		} catch (e) {
			error(__('Failed to save settings!', 'pojo-accessibility'));
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
				{__('Save changes', 'pojo-accessibility')}
			</Button>
		</Box>
	);
};

export default BottomBar;
