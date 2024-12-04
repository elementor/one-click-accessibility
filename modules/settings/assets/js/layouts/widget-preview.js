import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import { __ } from '@wordpress/i18n';

const WidgetPreview = () => {
	return (
		<Card variant="outlined">
			<CardHeader
				title={__('Preview', 'pojo-accessibility')}
				subheader={__(
					'This is what the widget will look like to your site viewers.',
					'pojo-accessibility',
				)}
			/>
			<CardContent sx={{ height: '50vh', overflow: 'auto' }}></CardContent>
		</Card>
	);
};

export default WidgetPreview;
