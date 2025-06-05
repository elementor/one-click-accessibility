import Box from '@elementor/ui/Box';
import FormLabel from '@elementor/ui/FormLabel';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemSecondaryAction from '@elementor/ui/ListItemSecondaryAction';
import ListItemText from '@elementor/ui/ListItemText';
import { CustomSwitch, ProItemInfotip } from '@ea11y/components';
import SitemapSettings from '@ea11y/components/sitemap-settings';
import { useSettings } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { validateUrl } from '../../utils';

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

	/**
	 * Check if the feature is enabled in user's plan.
	 * @return {boolean} true if the feature is enabled.
	 */
	const isProEnabled = () => {
		const features = planData?.plan?.features;
		return features?.[childKey.replace('-', '_')];
	};

	/**
	 * Toggle the menu setting value in the state.
	 * @param {string} category - parent category.
	 * @param {string} option   - option key.
	 */
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
				mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
					state: prevSettings[option]?.enabled ? 'off' : 'on',
					type: option,
				});
			}

			return newSettings;
		});
	};

	/**
	 * Check if the switch is disabled or not.
	 * @return {boolean} true if the switch is disabled.
	 */
	const isDisabled = () => {
		if (childValue?.pro && !isProEnabled()) {
			return true;
		}

		return widgetMenuSettings[childKey]?.enabled ? disableOptions : false;
	};

	return (
		<ListItem as="div" key={childKey} disableGutters sx={{ p: '4px' }}>
			{childKey === 'sitemap' ? (
				<SitemapSettings sitemap={childValue} />
			) : (
				<>
					<ListItemIcon>{childValue.icon}</ListItemIcon>

					<Box display="flex" flexDirection="row" alignItems="center">
						<FormLabel htmlFor={`ea11y-${childKey}-toggle`}>
							<ListItemText primary={childValue.title} />
						</FormLabel>

						{childValue?.pro && !isProEnabled() && (
							<ProItemInfotip
								source="icon"
								childKey={childKey}
								childValue={childValue}
								enabled={isProEnabled()}
								showIcon={true}
							/>
						)}
					</Box>
				</>
			)}

			<ListItemSecondaryAction sx={{ top: '19px' }}>
				<ProItemInfotip
					source="toggle"
					childKey={childKey}
					childValue={childValue}
					enabled={isProEnabled()}
				>
					<CustomSwitch
						id={`ea11y-${childKey}-toggle`}
						checked={widgetMenuSettings[childKey]?.enabled || false}
						onChange={() => toggleSetting(parentKey, childKey)}
						disabled={isDisabled()}
					/>
				</ProItemInfotip>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default CapabilitiesItem;
