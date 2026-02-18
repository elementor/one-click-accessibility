import CrownFilledIcon from '@elementor/icons/CrownFilledIcon';
import Button from '@elementor/ui/Button';
import Infotip from '@elementor/ui/Infotip';
import { useModal } from '@ea11y/hooks';
import { mixpanelEvents } from '@ea11y-apps/global/services/mixpanel/mixpanel-events';
import { mixpanelService } from '@ea11y-apps/global/services/mixpanel/mixpanel-service';
import BulkAltTextManager from '@ea11y-apps/scanner/components/bulk-alt-text/bulk-alt-text-manager';
import UpgradeInfotip from '@ea11y-apps/scanner/components/bulk-alt-text/upgrade-infotip';
import { IS_PRO_PLAN } from '@ea11y-apps/scanner/constants';
import WandIcon from '@ea11y-apps/scanner/icons/wand-icon';
import { __ } from '@wordpress/i18n';

const BulkAltTextButton = () => {
	const { open, close, isOpen } = useModal(false);

	const handleBulkAltTextClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.bulkAltTextClicked);
		open();
	};

	if (!IS_PRO_PLAN) {
		return (
			<Infotip
				content={
					<UpgradeInfotip
						trigger={{
							feature: 'bulk_alt_text',
							component: 'bulk_assistant_button',
						}}
						action={{
							feature: 'bulk_wizard_banner',
							component: 'button',
						}}
					/>
				}
				placement="bottom"
				PopperProps={{
					disablePortal: true,
					sx: { width: 300 },
				}}
			>
				<Button
					color="promotion"
					variant="outlined"
					startIcon={<CrownFilledIcon />}
					size="small"
				>
					{__('Bulk alt text', 'pojo-accessibility')}
				</Button>
			</Infotip>
		);
	}

	return (
		<>
			<Button
				color="info"
				variant="outlined"
				startIcon={<WandIcon />}
				size="small"
				onClick={handleBulkAltTextClick}
				aria-label={__('Open bulk alt text manager', 'pojo-accessibility')}
			>
				{__('Bulk alt text', 'pojo-accessibility')}
			</Button>
			<BulkAltTextManager open={isOpen} close={close} />
		</>
	);
};

export default BulkAltTextButton;
