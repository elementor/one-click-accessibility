import { CrownIcon } from '@elementor/icons';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

const ProItemInfotip = () => {
	return (
		<Card elevation={0} sx={{ maxWidth: 300 }}>
			<CardHeader
				title={__('Access more advanced features', 'pojo-accessibility')}
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{__(
						'Upgrade to get more customization and other pro features to boost your site.',
						'pojo-accessibility',
					)}
				</Typography>
			</CardContent>
			<CardActions>
				<Button
					size="medium"
					color="promotion"
					variant="contained"
					startIcon={<CrownIcon />}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);
};

export default ProItemInfotip;
