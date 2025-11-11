import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { PAGE_LIMIT_URL, PAGE_PER_PLAN } from '@ea11y-apps/scanner/constants';
import { QuotaImage } from '@ea11y-apps/scanner/images/quota-image';
import {
	QuotaMessageContainer,
	StateContainer,
} from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const QuotaMessage = () => {
	const onUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			action_trigger: 'scan_triggered',
			feature_locked: 'multi-page scan',
		});
	};

	return (
		<StateContainer>
			<QuotaImage />
			<QuotaMessageContainer>
				<Typography variant="h5" align="center">
					{__('Scan and improve more pages', 'pojo-accessibility')}
				</Typography>
				<Typography variant="body2" align="center">
					{sprintf(
						// Translators: $s - page limit
						__(
							'Your current plan allows scanning up to %s unique URLs. Upgrade to scan more and keep your site accessible.',
							'pojo-accessibility',
						),
						PAGE_PER_PLAN,
					)}
				</Typography>
			</QuotaMessageContainer>

			<Button
				size="small"
				color="promotion"
				variant="contained"
				href={PAGE_LIMIT_URL}
				target="_blank"
				rel="noreferrer"
				startIcon={<CrownFilled />}
				onClick={onUpgrade}
			>
				{__('Upgrade now', 'pojo-accessibility')}
			</Button>
		</StateContainer>
	);
};
