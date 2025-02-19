import { CardActions, ListItemSecondaryAction } from '@elementor/ui';
import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
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
import SitemapSettings from '@ea11y/components/sitemap-settings';
import { useSettings, useStorage } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MENU_SETTINGS } from '../constants/menu-settings';
import { validateUrl } from '../utils';

const StyledSwitch = styled(Switch)`
	input {
		height: 56px !important;
	}
`;

const StyledCardContent = styled(CardContent)`
	height: 55vh;
	overflow: auto;
	margin-bottom: 61.5px;
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;

const StyledCardActions = styled(CardActions)`
	position: absolute;
	width: 100%;
	bottom: 0;

	padding: 0;
	background: ${({ theme }) => theme.palette.background.paper};

	& .MuiBox-root {
		padding: ${({ theme }) => theme.spacing(1.5)}
			${({ theme }) => theme.spacing(2)};
	}
`;

const MenuSettings = () => {
	const {
		widgetMenuSettings,
		setWidgetMenuSettings,
		setHasChanges,
		hasError,
		setHasError,
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

	const toggleSetting = (category, option) => {
		setWidgetMenuSettings((prevSettings) => {
			const newSettings = {
				...prevSettings,
				[option]: {
					...prevSettings[option],
					enabled: !prevSettings[option]?.enabled,
				},
			};

			if (option === 'sitemap') {
				setHasError({
					...hasError,
					sitemap: !prevSettings[option]?.enabled
						? !validateUrl(prevSettings[option]?.url)
						: false,
				});
			}

			setHasChanges(true);

			if (window?.ea11yWidget?.toolsSettings && window?.ea11yWidget?.widget) {
				window.ea11yWidget.toolsSettings = newSettings;
				window?.ea11yWidget?.widget.updateState();
			}

			if (prevSettings[option]) {
				mixpanelService.sendEvent('toggle_clicked', {
					state: prevSettings[option]?.enabled ? 'off' : 'on',
					type: option,
				});
			}

			return newSettings;
		});
	};

	const areAtLeastTwoOptionsEnabled = (settings) => {
		const enabled = Object.keys(settings)?.filter(
			(key) => settings[key].enabled,
		);
		return enabled.length > 2;
	};

	const handleCloseNotification = () => {
		save({ a11y_hide_minimum_active_options_alert: true }).then(() => {
			setHideMinimumOptionAlert(true);
		});
	};

	const sectionsCount = Object.entries(MENU_SETTINGS).length;

	return (
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
				<Alert severity="info" sx={{ m: 2 }} onClose={handleCloseNotification}>
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
												<ListItem
													as="div"
													key={childKey}
													disableGutters
													sx={{ p: '4px' }}
												>
													{childKey === 'sitemap' ? (
														<SitemapSettings sitemap={childValue} />
													) : (
														<>
															<ListItemIcon>{childValue.icon}</ListItemIcon>
															<ListItemText primary={childValue.title} />
														</>
													)}

													<ListItemSecondaryAction sx={{ top: '19px' }}>
														<StyledSwitch
															size="medium"
															color="info"
															checked={
																widgetMenuSettings[childKey]?.enabled || false
															}
															onChange={() =>
																toggleSetting(parentKey, childKey)
															}
															disabled={
																widgetMenuSettings[childKey]?.enabled
																	? disableOptions
																	: false
															}
														/>
													</ListItemSecondaryAction>
												</ListItem>
											);
										},
									)}

								{i + 1 < sectionsCount && <Divider sx={{ my: 2 }} />}
							</Box>
						);
					})}
				</List>
			</StyledCardContent>

			<StyledCardActions>
				<BottomBar />
			</StyledCardActions>
		</Card>
	);
};

export default MenuSettings;
