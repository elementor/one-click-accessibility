import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import { WidgetLoader } from '@ea11y/components';
import { __ } from '@wordpress/i18n';

const WidgetPreview = () => {
	return (
		<>
			<Card variant="outlined">
				<CardHeader
					title={__('Preview', 'pojo-accessibility')}
					subheader={__(
						'This is what the widget will look like to your site viewers.',
						'pojo-accessibility',
					)}
				/>
				<CardContent
					id="ea11y-widget-preview--container"
					sx={{ height: '50vh', overflow: 'auto' }}
				></CardContent>
			</Card>
			<WidgetLoader />
		</>
	);
};

export default WidgetPreview;
