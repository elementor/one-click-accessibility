import { CrownIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Chip from '@elementor/ui/Chip';
import Infotip from '@elementor/ui/Infotip';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemSecondaryAction from '@elementor/ui/ListItemSecondaryAction';
import ListItemText from '@elementor/ui/ListItemText';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import SitemapSettings from '@ea11y/components/sitemap-settings';
import { useSettings } from '@ea11y/hooks';
import { ProCrownIcon } from '@ea11y/icons';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { validateUrl } from '../../utils';

const StyledSwitch = styled(Switch)`
	input {
		height: 56px !important;
	}
`;

const CapabilitiesItem = ({
	childKey,
	childValue,
	parentKey,
	disableOptions,
}) => {
	const {
		widgetMenuSettings,
		setWidgetMenuSettings,
		setHasChanges,
		hasError,
		setHasError,
		planData,
	} = useSettings();

	console.log(planData);

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

	return (
		<ListItem as="div" key={childKey} disableGutters sx={{ p: '4px' }}>
			{childKey === 'sitemap' ? (
				<SitemapSettings sitemap={childValue} />
			) : (
				<>
					<ListItemIcon>{childValue.icon}</ListItemIcon>
					<Box display="flex" flexDirection="row" gap={1} alignItems="center">
						<ListItemText primary={childValue.title} />
						{childValue?.pro && (
							<Infotip
								placement="top"
								content={
									<Card elevation={0} sx={{ maxWidth: 300 }}>
										<CardHeader
											title={__(
												'Access more advanced features',
												'pojo-accessibility',
											)}
										/>
										<CardContent>
											<Typography variant="body2" color="text.secondary">
												{__(
													'Upgrade to get more customization and other pro features to boost your site.',
													'pojo-accessibility',
												)}
											</Typography>
										</CardContent>
										<CardActions>
											<Button
												size="medium"
												color="promotion"
												variant="contained"
												startIcon={<CrownIcon />}
											>
												{__('Upgrade now', 'pojo-accessibility')}
											</Button>
										</CardActions>
									</Card>
								}
								disableFocusListener
								PopperProps={{
									sx: {
										zIndex: 9999999999, // Custom z-index for the popper
									},
								}}
							>
								<Chip
									color="promotion"
									variant="standard"
									icon={<ProCrownIcon />}
									size="small"
								/>
							</Infotip>
						)}
					</Box>
				</>
			)}

			<ListItemSecondaryAction sx={{ top: '19px' }}>
				<StyledSwitch
					size="medium"
					color="info"
					checked={widgetMenuSettings[childKey]?.enabled || false}
					onChange={() => toggleSetting(parentKey, childKey)}
					disabled={
						widgetMenuSettings[childKey]?.enabled ? disableOptions : false
					}
				/>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default CapabilitiesItem;
