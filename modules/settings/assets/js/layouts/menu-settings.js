import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Divider from '@elementor/ui/Divider';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemText from '@elementor/ui/ListItemText';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { CapabilitiesItem } from '@ea11y/components';
import { useSettings, useStorage } from '@ea11y/hooks';
import { LogoSettings } from '@ea11y/layouts';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MENU_SETTINGS } from '../constants/menu-settings';

const StyledCardContent = styled(CardContent)`
	height: 55vh;
	overflow: auto;
	margin-bottom: ${({ theme }) => theme.spacing(2)};
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;

const MenuSettings = () => {
	const {
		widgetMenuSettings,
		hideMinimumOptionAlert,
		setHideMinimumOptionAlert,
	} = useSettings();
	const [disableOptions, setDisableOptions] = useState(false);
	const { save } = useStorage();

	useEffect(() => {
		if (!areAtLeastTwoOptionsEnabled(widgetMenuSettings)) {
			setDisableOptions(true);
		} else {
			setDisableOptions(false);

			save({ a11y_hide_minimum_active_options_alert: false }).then(() => {
				setHideMinimumOptionAlert(false);
			});
		}
	}, [widgetMenuSettings]);

	/**
	 * Check if at least two options are enabled.
	 * @param {Object} settings - widget menu settings.
	 * @return {boolean} true if at least two options are enabled.
	 */
	const areAtLeastTwoOptionsEnabled = (settings) => {
		const enabled = Object.keys(settings)?.filter(
			(key) => settings[key].enabled,
		);
		return enabled.length > 2;
	};

	/**
	 * Close minimum option notification.
	 */
	const handleCloseNotification = () => {
		save({ a11y_hide_minimum_active_options_alert: true }).then(() => {
			setHideMinimumOptionAlert(true);
		});
	};

	const sectionsCount = Object.entries(MENU_SETTINGS).length;

	return (
		<Box display="flex" flexDirection="column" gap={2}>
			<Card variant="outlined">
				<CardHeader
					title={__('Feature Menu', 'pojo-accessibility')}
					subheader={
						<Typography variant="body2">
							{__(
								'Choose which accessibility features and capabilities you want to include.',
								'pojo-accessibility',
							)}
						</Typography>
					}
				/>

				{disableOptions && !hideMinimumOptionAlert && (
					<Alert
						severity="info"
						sx={{ m: 2 }}
						onClose={handleCloseNotification}
					>
						{__('At least two option must remain active', 'pojo-accessibility')}
					</Alert>
				)}

				<StyledCardContent>
					<List as="div">
						{Object.entries(MENU_SETTINGS).map(([parentKey, parentItem], i) => {
							return (
								<Box key={parentKey}>
									<ListItem as="div" disableGutters>
										<ListItemText>
											<Typography variant="subtitle2">
												{parentItem.title}
											</Typography>
										</ListItemText>
									</ListItem>

									{parentItem.options &&
										Object.entries(parentItem.options).map(
											([childKey, childValue]) => {
												return (
													<CapabilitiesItem
														key={childKey}
														childKey={childKey}
														childValue={childValue}
														parentKey={parentKey}
														disableOptions={disableOptions}
													/>
												);
											},
										)}

									{i + 1 < sectionsCount && <Divider sx={{ my: 2 }} />}
								</Box>
							);
						})}
					</List>
				</StyledCardContent>
			</Card>
			<LogoSettings />
		</Box>
	);
};

export default MenuSettings;
