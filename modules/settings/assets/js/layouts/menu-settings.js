import { CardActions } from '@elementor/ui';
import Alert from '@elementor/ui/Alert';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Divider from '@elementor/ui/Divider';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { BottomBar } from '@ea11y/components';
import { useSettings, useStorage } from '@ea11y/hooks';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MENU_SETTINGS } from '../constants/menu-settings';

// Customization for the WP admin global CSS.
const StyledSwitch = styled(Switch)(() => ({
	input: {
		height: '56px',
	},
}));

const MenuSettings = () => {
	const {
		widgetMenuSettings,
		setWidgetMenuSettings,
		setHasChanges,
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
	// Function to toggle the value of a setting
	const toggleSetting = (category, option) => {
		setWidgetMenuSettings((prevSettings) => {
			const newSettings = {
				...prevSettings,
				[category]: {
					...prevSettings[category],
					[option]: !prevSettings[category][option],
				},
			};

			setHasChanges(true); // Mark as changed
			return newSettings;
		});
	};

	// Function to check if at least two options are enabled
	const areAtLeastTwoOptionsEnabled = (settings) => {
		let enabledCount = 0;

		// Iterate through each category in settings
		for (const category in settings) {
			if (settings.hasOwnProperty(category)) {
				// Count enabled options in the current category
				for (const option in settings[category]) {
					if (settings[category][option]) {
						enabledCount++;
					}
				}
			}
		}

		return enabledCount > 2; // Return true if at least two options are enabled
	};

	const handleCloseNotification = () => {
		save({ a11y_hide_minimum_active_options_alert: true }).then(() => {
			setHideMinimumOptionAlert(true);
		});
	};
	return (
		<Card variant="outlined">
			<CardHeader
				title={__('Menu Items', 'pojo-accessibility')}
				subheader={__(
					'Select below the items that you want to appear in the widget.',
					'pojo-accessibility',
				)}
			/>
			{disableOptions && !hideMinimumOptionAlert && (
				<Alert severity="info" sx={{ m: 2 }} onClose={handleCloseNotification}>
					{__('At least two option must remain active', 'pojo-accessibility')}
				</Alert>
			)}
			<CardContent
				sx={{ height: '50vh', overflow: 'auto', marginBottom: '100px' }}
			>
				<List>
					{Object.entries(MENU_SETTINGS).map(([parentKey, parentItem]) => {
						return (
							<div key={parentKey}>
								<ListItem disableGutters>
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
												<ListItem
													key={childKey}
													disableGutters
													sx={{ p: '4px' }}
													secondaryAction={
														<StyledSwitch
															size="medium"
															color="info"
															checked={
																widgetMenuSettings[parentKey]?.[childKey] ||
																false
															}
															onChange={() =>
																toggleSetting(parentKey, childKey)
															}
															disabled={
																widgetMenuSettings[parentKey]?.[childKey]
																	? disableOptions
																	: false
															}
														/>
													}
												>
													<ListItemIcon>{childValue.icon}</ListItemIcon>
													<ListItemText primary={childValue.title} />
												</ListItem>
											);
										},
									)}
								<Divider sx={{ my: 2 }} />
							</div>
						);
					})}
				</List>
			</CardContent>
			<CardActions
				sx={{
					position: 'absolute',
					bottom: 0,
					width: '100%',
					background: 'white',
				}}
			>
				<BottomBar />
			</CardActions>
		</Card>
	);
};

export default MenuSettings;
