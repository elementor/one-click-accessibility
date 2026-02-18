import XIcon from '@elementor/icons/XIcon';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { getUpgradeLink } from '@ea11y-apps/global/utils/upgrade-link';
import {
	COMPARE_PLAN_URL,
	IS_PRO_PLAN,
	UPGRADE_URL,
	BULK_UPGRADE_URL,
} from '@ea11y-apps/scanner/constants';
import { UpgradeContentContainer } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	InfotipFooter,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const UpgradeContent = ({
	closeUpgrade,
	isAlt = false,
	isBulkAlt = false,
	isBulkSingleImage = false,
}) => {
	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeTooltipTriggered, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			component: 'button_wizard_main_button',
			feature: 'bulk_alt_text',
		});
	}, [isBulkAlt]);
	const onUpgrade = () => {
		if (isBulkAlt) {
			mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
				current_plan: window.ea11yScannerData?.planData?.plan?.name,
				component: 'button',
				feature: isBulkSingleImage
					? 'bulk_wizard_single_image'
					: 'bulk_wizard_main_cta',
			});
		} else {
			mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
				current_plan: window.ea11yScannerData?.planData?.plan?.name,
				action_trigger: 'ai_suggestionf_accepted',
				feature_locked: isAlt ? 'AI alt-text' : 'AI manual',
			});
		}
	};

	const getURL = () => {
		if (isBulkAlt) {
			return getUpgradeLink(BULK_UPGRADE_URL);
		}
		if (IS_PRO_PLAN) {
			return getUpgradeLink(COMPARE_PLAN_URL);
		}
		return getUpgradeLink(UPGRADE_URL);
	};

	return (
		<InfotipBox>
			<UpgradeContentContainer>
				<Typography variant="subtitle1" sx={{ mb: 3 }}>
					{IS_PRO_PLAN
						? __("You've reached the monthly limit", 'pojo-accessibility')
						: __('Resolve issues automatically with AI', 'pojo-accessibility')}
				</Typography>
				{closeUpgrade && (
					<IconButton
						onClick={closeUpgrade}
						size="small"
						edge="end"
						sx={{ mt: -1 }}
					>
						<XIcon />
					</IconButton>
				)}
			</UpgradeContentContainer>
			<Typography variant="body2" color="secondary" sx={{ mb: 2 }}>
				{IS_PRO_PLAN
					? __(
							'To work more magic with AI, upgrade your plan or wait until next month.',
							'pojo-accessibility',
						)
					: __(
							"Upgrade your plan to skip the manual work and have Ally's AI auto-resolve accessibility issues for you.",
							'pojo-accessibility',
						)}
			</Typography>
			<InfotipFooter>
				<Button
					size="small"
					color="promotion"
					variant="contained"
					href={getURL()}
					target="_blank"
					rel="noreferrer"
					startIcon={!IS_PRO_PLAN ? <CrownFilled /> : null}
					onClick={onUpgrade}
				>
					{IS_PRO_PLAN
						? __('Compare plans', 'pojo-accessibility')
						: __('Upgrade now', 'pojo-accessibility')}
				</Button>
			</InfotipFooter>
		</InfotipBox>
	);
};

UpgradeContent.propTypes = {
	closeUpgrade: PropTypes.func,
	isAlt: PropTypes.bool,
};
