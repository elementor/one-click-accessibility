import { InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import FormLabel from '@elementor/ui/FormLabel';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { validateId } from '../../utils';

const SkipToContentSettings = () => {
	const { save } = useStorage();
	const { success, error } = useToastNotification();

	const {
		skipToContentSettings,
		setSkipToContentSettings,
		skipToContentHasChanges,
		setSkipToContentHasChanges,
		hasError,
		setHasError,
	} = useSettings();

	const toggleSetting = () => {
		setSkipToContentSettings({
			...skipToContentSettings,
			enabled: !skipToContentSettings.enabled,
		});
		setHasError({
			...hasError,
			sitemap: !skipToContentSettings?.enabled
				? !validateId(skipToContentSettings?.anchor)
				: false,
		});
		setSkipToContentHasChanges(true);
	};

	const onEditSkipToContent = (event) => {
		setSkipToContentSettings({
			...skipToContentSettings,
			anchor: event.target.value,
		});

		const isValid = validateId(event.target.value);

		setHasError({
			...hasError,
			skipToContent: !isValid,
		});
		setSkipToContentHasChanges(isValid);
	};

	const onBlur = () => {
		if (skipToContentHasChanges) {
			mixpanelService.sendEvent('field_content_updated', {
				fieldName: 'skip-to-content-anchor',
				value: skipToContentSettings.anchor,
			});
		}
	};

	const saveSettings = async () => {
		try {
			const savedData = {
				ea11y_skip_to_content_settings: skipToContentSettings,
			};

			await save(savedData);

			success(__('Settings saved!', 'pojo-accessibility'));

			setSkipToContentHasChanges(false);

			mixpanelService.sendEvent('save_button_clicked', {
				savedData,
			});
		} catch (e) {
			error(__('Failed to save settings!', 'pojo-accessibility'));
		}
	};

	const isSubmitDisabled =
		!skipToContentSettings.anchor ||
		!skipToContentHasChanges ||
		hasError.skipToContent;
	return (
		<Card variant="outlined" sx={{ padding: 2, marginBlock: 4 }}>
			<StyledBox>
				<Typography variant="subtitle1">
					{__('Skip to main content', 'pojo-accessibility')}
				</Typography>
				<StyledSwitch
					size="medium"
					color="info"
					checked={skipToContentSettings?.enabled || false}
					onChange={toggleSetting}
				/>
			</StyledBox>
			<Typography variant="body1">
				{__(
					'Add skip to content link when using keyboard',
					'pojo-accessibility',
				)}
			</Typography>
			<StyledFormItem>
				<StyledFormLabel htmlFor="skip-to-content-anchor">
					{__('Content element ID', 'pojo-accessibility')}

					<Infotip
						content={
							<Box sx={{ p: 2, maxWidth: '250px' }}>
								<Typography variant="subtitle2" sx={{ mb: 1 }}>
									{__('Skip to main content', 'pojo-accessibility')}
								</Typography>
								<Typography variant="body2">
									{__(
										'This feature allows visitors with visual assistive tools to skip to the main content of each page they’re viewing.',
										'pojo-accessibility',
									)}
								</Typography>
							</Box>
						}
						placement="right"
						arrow={true}
					>
						<InfoCircleIcon fontSize="small" />
					</Infotip>
				</StyledFormLabel>
				<Box>
					<StyledTextField
						id="skip-to-content-anchor"
						type="url"
						onChange={onEditSkipToContent}
						onBlur={onBlur}
						value={skipToContentSettings.anchor}
						error={hasError.skipToContent}
						size="small"
						variant="outlined"
					/>
					{hasError.skipToContent && (
						<Typography
							as="p"
							variant="caption"
							color="error"
							sx={{ marginTop: '4px' }}
						>
							{__('Please enter valid ID!', 'pojo-accessibility')}
						</Typography>
					)}
				</Box>
				<Button
					variant="contained"
					color="info"
					onClick={saveSettings}
					disabled={isSubmitDisabled}
				>
					{__('Save changes', 'pojo-accessibility')}
				</Button>
			</StyledFormItem>
		</Card>
	);
};

const StyledBox = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const StyledSwitch = styled(Switch)`
	input {
		height: 56px !important;
	}
`;

const StyledFormItem = styled(Box)`
	display: flex;
	gap: 16px;
	align-items: flex-start;
	justify-content: end;
	padding-top: 16px;
`;

const StyledFormLabel = styled(FormLabel)`
	display: flex;
	align-items: center;
	gap: 8px;
	white-space: nowrap;
	padding-top: 7px;
`;

const StyledTextField = styled(TextField)`
	width: 200px;
	input {
		height: 36px;
	}
`;

export default SkipToContentSettings;
