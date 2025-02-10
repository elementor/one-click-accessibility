import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import { styled } from '@elementor/ui/styles';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';

const StyledContainer = styled(Box)`
	width: 100%;
	display: flex;
	justify-content: flex-end;

	padding: ${({ theme }) => theme.spacing(2)};
	border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;

const BottomBar = () => {
	const {
		selectedMenu,
		widgetMenuSettings,
		iconDesign,
		iconPosition,
		hasChanges,
		hasError,
		setHasChanges,
	} = useSettings();
	const { save } = useStorage();
	const { success, error } = useToastNotification();

	const saveSettings = async () => {
		let savedData = {};

		if (selectedMenu.parent === 'capabilities') {
			savedData = {
				ea11y_widget_menu_settings: widgetMenuSettings,
			};
		} else if (selectedMenu.parent === 'design') {
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
		<StyledContainer>
			<Button
				variant="contained"
				color="info"
				onClick={saveSettings}
				disabled={
					!hasChanges || Object.keys(hasError).some((key) => hasError[key])
				}
			>
				{__('Save changes', 'pojo-accessibility')}
			</Button>
		</StyledContainer>
	);
};

export default BottomBar;
