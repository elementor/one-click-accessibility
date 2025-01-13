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
					sx={{
						overflow: 'auto',
						marginRight: 'auto',
						marginLeft: 'auto',
						marginTop: 4,
						padding: '0 24px',
					}}
				></CardContent>
			</Card>
			<WidgetLoader />
		</>
	);
};

export default WidgetPreview;
