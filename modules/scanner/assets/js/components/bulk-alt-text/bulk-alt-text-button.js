import CrownFilledIcon from '@elementor/icons/CrownFilledIcon';
import Button from '@elementor/ui/Button';
import Infotip from '@elementor/ui/Infotip';
import UpgradeInfotip from '@ea11y-apps/scanner/components/bulk-alt-text/upgrade-infotip';
import { IS_PRO_PLAN } from '@ea11y-apps/scanner/constants';
import WandIcon from '@ea11y-apps/scanner/icons/wand-icon';
import { __ } from '@wordpress/i18n';

const BulkAltTextButton = () => {
	if (!IS_PRO_PLAN) {
		return (
			<Infotip
				content={<UpgradeInfotip />}
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
		<Button
			color="info"
			variant="outlined"
			startIcon={<WandIcon />}
			size="small"
		>
			{__('Bulk alt text', 'pojo-accessibility')}
		</Button>
	);
};

export default BulkAltTextButton;
