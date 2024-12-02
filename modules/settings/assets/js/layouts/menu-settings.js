import { CardActions } from '@elementor/ui';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Divider from '@elementor/ui/Divider';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Switch from '@elementor/ui/Switch';
import { styled } from '@elementor/ui/styles';
import { BottomBar } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { MENU_SETTINGS } from '../constants/menu-settings';

// Customization for the WP admin global CSS.
const StyledSwitch = styled(Switch)(() => ({
	input: {
		height: '56px',
	},
}));

const MenuSettings = () => {
	const { widgetMenuSettings, setWidgetMenuSettings, setHasChanges } =
		useSettings();
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
	return (
		<Card variant="outlined">
			<CardHeader
				title={__('Menu Items', 'pojo-accessibility')}
				subheader={__(
					'Select below the items that you want to appear in the widget.',
					'pojo-accessibility',
				)}
			/>
			<CardContent sx={{ height: '50vh', overflow: 'auto' }}>
				<List>
					{Object.entries(MENU_SETTINGS).map(([parentKey, parentItem]) => {
						return (
							<div key={parentKey}>
								<ListItem disableGutters>
									<ListItemText primary={parentItem.title} />
								</ListItem>
								{parentItem.options &&
									Object.entries(parentItem.options).map(
										([childKey, childValue]) => {
											return (
												<ListItem
													key={childKey}
													disableGutters
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
														/>
													}
												>
													<ListItemIcon>{childValue.icon}</ListItemIcon>
													<ListItemText primary={childValue.title} />
												</ListItem>
											);
										},
									)}
								<Divider />
							</div>
						);
					})}
				</List>
			</CardContent>
			<CardActions>
				<BottomBar />
			</CardActions>
		</Card>
	);
};

export default MenuSettings;
