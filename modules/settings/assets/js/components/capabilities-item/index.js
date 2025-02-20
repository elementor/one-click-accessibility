import Box from '@elementor/ui/Box';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemSecondaryAction from '@elementor/ui/ListItemSecondaryAction';
import ListItemText from '@elementor/ui/ListItemText';
import Switch from '@elementor/ui/Switch';
import { styled } from '@elementor/ui/styles';
import SitemapSettings from '@ea11y/components/sitemap-settings';
import { useSettings } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { validateUrl } from '../../utils';
import ProItemInfotip from './pro-item-infotip';

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

	/**
	 * Check if the feature is enabled in user's plan.
	 * @return {boolean} true if the feature is enabled.
	 */
	const isProEnabled = () => {
		return planData?.[childKey.replace('-', '_')];
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
				mixpanelService.sendEvent('toggle_clicked', {
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
					<Box display="flex" flexDirection="row" gap={1} alignItems="center">
						<ListItemText primary={childValue.title} />
						{childValue?.pro && !isProEnabled() && <ProItemInfotip />}
					</Box>
				</>
			)}

			<ListItemSecondaryAction sx={{ top: '19px' }}>
				<StyledSwitch
					size="medium"
					color="info"
					checked={widgetMenuSettings[childKey]?.enabled || false}
					onChange={() => toggleSetting(parentKey, childKey)}
					disabled={isDisabled()}
				/>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default CapabilitiesItem;
