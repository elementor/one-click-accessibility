import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { mixpanelEvents } from '@ea11y-apps/global/services/mixpanel/mixpanel-events';
import { mixpanelService } from '@ea11y-apps/global/services/mixpanel/mixpanel-service';
import { UPGRADE_URL } from '@ea11y-apps/scanner/constants';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const UpgradeInfotip = () => {
	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeTooltipTriggered, {
			feature: 'bulk_alt_text',
			component: 'bulk_wizard_banner',
		});
	}, []);

	const onUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			feature: 'bulk_alt_text',
			component: 'bulk_wizard_banner',
		});
	};
	return (
		<Card>
			<CardHeader
				title={__('Bulk-generate alt text with AI', 'pojo-accessibility')}
				titleTypographyProps={{
					variant: 'subtitle2',
				}}
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{__(
						'Upgrade to handle alt text in bulk: generate or mark as decorative, in one click.',
						'pojo-accessibility',
					)}
				</Typography>
			</CardContent>
			<CardActions>
				<Button
					size="small"
					color="promotion"
					variant="contained"
					href={UPGRADE_URL}
					target="_blank"
					onClick={onUpgrade}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);
};

export default UpgradeInfotip;
