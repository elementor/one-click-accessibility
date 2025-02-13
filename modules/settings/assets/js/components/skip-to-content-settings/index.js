import { InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import FormLabel from '@elementor/ui/FormLabel';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { validateId } from '../../utils';

const SkipToContentSettings = () => {
	const {
		skipToContentSettings,
		setSkipToContentSettings,
		skipToContentHasChanges,
		setSkipToContentHasChanges,
		setHasChanges,
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
		setHasChanges(true);
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
		setHasChanges(isValid);
	};

	const onBlur = () => {
		if (skipToContentHasChanges) {
			mixpanelService.sendEvent('field_content_updated', {
				fieldName: 'skip-to-content-anchor',
				value: skipToContentSettings.anchor,
			});
		}
	};

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
