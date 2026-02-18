import AIIcon from '@elementor/icons/AIIcon';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import InputAdornment from '@elementor/ui/InputAdornment';
import Tooltip from '@elementor/ui/Tooltip';
import PropTypes from 'prop-types';
import { mixpanelEvents } from '@ea11y-apps/global/services/mixpanel/mixpanel-events';
import { mixpanelService } from '@ea11y-apps/global/services/mixpanel/mixpanel-service';
import { UpgradeContent } from '@ea11y-apps/scanner/components/upgrade-info-tip/upgrade-content';
import { AI_QUOTA_LIMIT, IS_PRO_PLAN } from '@ea11y-apps/scanner/constants';
import { __ } from '@wordpress/i18n';

const AIGenerateButton = ({ onGenerate, disabled, isLoading }) => {
	const onUpgradeHover = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeSuggestionViewed, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			component: 'bulk_wizard_single_image',
			feature: 'bulk_alt_text',
		});
	};

	return (
		<InputAdornment
			position="end"
			sx={{
				marginBlockStart: 2.5,
				marginInlineEnd: 1,
				alignSelf: 'flex-start',
			}}
		>
			{IS_PRO_PLAN && AI_QUOTA_LIMIT ? (
				<Tooltip
					placement="top-end"
					title={__(
						'Generate an Alt text description with AI.',
						'pojo-accessibility',
					)}
					PopperProps={{
						disablePortal: true,
					}}
					slotProps={{
						tooltip: {
							sx: {
								maxWidth: '101px',
								whiteSpace: 'normal',
								lineHeight: 1.4,
							},
						},
					}}
				>
					<IconButton
						size="small"
						onClick={onGenerate}
						disabled={disabled}
						aria-label={
							isLoading
								? __('Generating alt text with AI', 'pojo-accessibility')
								: __('Click to generate alt text with AI', 'pojo-accessibility')
						}
					>
						<AIIcon color="info" fontSize="small" />
					</IconButton>
				</Tooltip>
			) : (
				<Infotip
					placement="top-end"
					slotProps={{
						tooltip: {
							id: 'ai-btn-description',
						},
					}}
					PopperProps={{
						disablePortal: true,
					}}
					content={<UpgradeContent isAlt isBulkAlt isBulkSingleImage />}
				>
					<IconButton
						size="small"
						aria-labelledby="ai-btn-description"
						onHover={onUpgradeHover}
					>
						<AIIcon color="promotion" />
					</IconButton>
				</Infotip>
			)}
		</InputAdornment>
	);
};

AIGenerateButton.propTypes = {
	onGenerate: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default AIGenerateButton;
