import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import FormLabel from '@elementor/ui/FormLabel';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { validateId } from '../../utils';

const SkipToContentSettings = () => {
	const {
		skipToContentSettings,
		setSkipToContentSettings,
		skipToContentHasChanges,
		setSkipToContentHasChanges,
		hasError,
		setHasError,
		setHasChanges,
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
			mixpanelService.sendEvent(mixpanelEvents.fieldContentUpdated, {
				fieldName: 'skip-to-content-anchor',
				value: skipToContentSettings.anchor,
			});
		}
	};

	const titleTooltipText = __(
		'This feature allows visitors with visual assistive tools to skip to the main content of each page they’re viewing.',
		'pojo-accessibility',
	);

	const idTooltipText = __(
		'This is the HTML ID of the main content area on your pages. Changing this is only needed if your theme uses a custom ID instead of the default #main-content.',
		'pojo-accessibility',
	);

	return (
		<StyledCard variant="outlined">
			<StyledBox>
				<StyledTypography
					variant="subtitle1"
					id="ea11y-skip-to-content-toggle"
					aria-description={titleTooltipText}
				>
					{__('Skip to main content', 'pojo-accessibility')}

					<Infotip
						tabIndex="0"
						content={
							<Box sx={{ p: 2, maxWidth: '250px' }}>
								<Typography variant="subtitle2" sx={{ mb: 1 }}>
									{__('Skip to main content', 'pojo-accessibility')}
								</Typography>

								<Typography variant="body2">{titleTooltipText}</Typography>
							</Box>
						}
						placement="right"
						arrow={true}
					>
						<InfoCircleIcon fontSize="small" />
					</Infotip>
				</StyledTypography>

				<StyledSwitch
					size="medium"
					color="info"
					checked={skipToContentSettings?.enabled || false}
					onChange={toggleSetting}
					inputProps={{
						'area-labelledby': 'ea11y-skip-to-content-toggle',
					}}
				/>
			</StyledBox>

			<Typography variant="body1">
				{__(
					'Add skip to content link when using keyboard',
					'pojo-accessibility',
				)}
			</Typography>

			<StyledFormItem>
				<StyledFormLabel
					htmlFor="skip-to-content-anchor"
					aria-description={idTooltipText}
				>
					{__('Main content ID', 'pojo-accessibility')}

					<Infotip
						tabIndex="0"
						content={
							<Box sx={{ p: 2, maxWidth: '250px' }}>
								<Typography variant="subtitle2" sx={{ mb: 1 }}>
									{__('Skip to main content', 'pojo-accessibility')}
								</Typography>

								<Typography variant="body2">{idTooltipText}</Typography>
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
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	padding: ${({ theme }) => theme.spacing(2)};
	margin-block: ${({ theme }) => theme.spacing(4)};
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
`;

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
	flex-direction: column;
	gap: 16px;
	align-items: flex-start;
	justify-content: start;
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

const StyledTypography = styled(Typography)`
	display: flex;
	gap: 8px;
	align-items: center;
`;

export default SkipToContentSettings;
