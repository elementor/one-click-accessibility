import XIcon from '@elementor/icons/XIcon';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	COMPARE_PLAN_URL,
	IS_PRO_PLAN,
	UPGRADE_URL,
} from '@ea11y-apps/scanner/constants';
import { UpgradeContentContainer } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	InfotipFooter,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { __ } from '@wordpress/i18n';

export const UpgradeContent = ({ closeUpgrade, isAlt = false }) => {
	const onUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			action_trigger: 'ai_suggestion_accepted',
			feature_locked: isAlt ? 'AI alt-text' : 'AI manual',
		});
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
					href={IS_PRO_PLAN ? COMPARE_PLAN_URL : UPGRADE_URL}
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
