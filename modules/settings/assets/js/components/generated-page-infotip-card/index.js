import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { useSettings, useStorage } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const GeneratedPageInfoTipCard = () => {
	const { setShowAccessibilityGeneratedInfotip } = useSettings();
	const { save } = useStorage();

	const dismissNotice = async () => {
		setShowAccessibilityGeneratedInfotip(false);

		await save({
			ea11y_show_accessibility_generated_page_infotip: false,
		});
	};

	return (
		<Card elevation={0} sx={{ maxWidth: 300 }}>
			<CardHeader title={''} />

			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{__(
						'We went ahead and linked the accessibility statement page you just created to your widget.',
						'pojo-accessibility',
					)}
				</Typography>
			</CardContent>

			<CardActions>
				<Button
					size="small"
					variant="contained"
					color="info"
					onClick={dismissNotice}
				>
					{__('Got it', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);
};

export default GeneratedPageInfoTipCard;
