import AIIcon from '@elementor/icons/AIIcon';
import Button from '@elementor/ui/Button';
import Infotip from '@elementor/ui/Infotip';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { UpgradeContent } from '@ea11y-apps/scanner/components/upgrade-info-tip/upgrade-content';
import { AI_QUOTA_LIMIT, IS_PRO_PLAN } from '@ea11y-apps/scanner/constants';

const GenerateAllButton = ({ onClick, disabled, text }) => {
	const onUpgradeHover = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeTooltipTriggered, {
			feature: 'bulk_alt_text',
			component: 'bulk_wizard_main_button',
		});
	};

	if (IS_PRO_PLAN && AI_QUOTA_LIMIT) {
		return (
			<Button
				color="info"
				variant="outlined"
				startIcon={<AIIcon />}
				onClick={onClick}
				disabled={disabled}
			>
				{text}
			</Button>
		);
	}

	return (
		<Infotip
			placement="top"
			slotProps={{
				tooltip: {
					id: 'generate-all-btn-upgrade',
				},
			}}
			PopperProps={{
				disablePortal: true,
			}}
			content={<UpgradeContent isAlt isBulkAlt />}
		>
			<Button
				color="promotion"
				variant="outlined"
				startIcon={<AIIcon />}
				aria-labelledby="generate-all-btn-upgrade"
				onMouseEnter={onUpgradeHover}
			>
				{text}
			</Button>
		</Infotip>
	);
};

GenerateAllButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired,
};

export default GenerateAllButton;
