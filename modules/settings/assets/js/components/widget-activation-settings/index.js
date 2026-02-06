import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';

const WidgetActivationSettings = () => {
	const {
		widgetActivationSettings,
		setWidgetActivationSettings,
		setHasChanges,
	} = useSettings();

	const toggleSetting = () => {
		const newValue = !widgetActivationSettings.enabled;

		setWidgetActivationSettings({
			...widgetActivationSettings,
			enabled: newValue,
		});

		setHasChanges(true);

		mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
			state: newValue ? 'on' : 'off',
			type: 'Widget activation',
		});
	};

	return (
		<StyledCard variant="outlined">
			<StyledBox>
				<StyledTypography
					variant="subtitle1"
					id="ea11y-widget-activation-toggle"
				>
					{__('Widget Activation', 'pojo-accessibility')}

					<Infotip
						tabIndex="0"
						content={
							<Box sx={{ padding: 2, maxWidth: '250px' }}>
								<Typography variant="subtitle2" sx={{ marginBlockEnd: 1 }}>
									{__('Widget Activation', 'pojo-accessibility')}
								</Typography>

								<Typography variant="body2">
									{__(
										'Disabling it will prevent the widget from loading entirely.',
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
				</StyledTypography>

				<StyledSwitch
					size="medium"
					color="info"
					checked={widgetActivationSettings.enabled ?? true}
					onChange={toggleSetting}
					inputProps={{
						'aria-labelledby': 'ea11y-widget-activation-toggle',
					}}
				/>
			</StyledBox>

			<Typography variant="body1">
				{__(
					'Enable or disable the accessibility widget on your website.',
					'pojo-accessibility',
				)}
			</Typography>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	padding: ${({ theme }) => theme.spacing(2)};
	margin-block: ${({ theme }) => theme.spacing(4)};
	margin-inline: auto;
	max-width: 1200px;
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

const StyledTypography = styled(Typography)`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export default WidgetActivationSettings;
