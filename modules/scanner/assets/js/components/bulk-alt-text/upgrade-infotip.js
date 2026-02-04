import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { UPGRADE_URL } from '@ea11y-apps/scanner/constants';
import { __ } from '@wordpress/i18n';

const UpgradeInfotip = () => {
	const onUpgrade = () => {
		//TODO: Add mixpanel event
		/* mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			action_trigger: 'ai_suggestion_accepted',
			feature_locked: isAlt ? 'AI alt-text' : 'AI manual',
		}); */
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
