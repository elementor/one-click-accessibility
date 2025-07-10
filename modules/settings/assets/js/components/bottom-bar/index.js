import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import Button from '@ea11y/components/button';
import { useSettings, useStorage } from '@ea11y/hooks';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';

const BottomBar = () => {
	const {
		selectedMenu,
		widgetMenuSettings,
		skipToContentSettings,
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
				ea11y_skip_to_content_settings: skipToContentSettings,
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

			mixpanelService.sendEvent(mixpanelEvents.saveButtonClicked, {
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

const StyledContainer = styled(Box)`
	width: 100%;
	display: flex;
	justify-content: flex-end;

	padding: ${({ theme }) => theme.spacing(2)};
	border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;
