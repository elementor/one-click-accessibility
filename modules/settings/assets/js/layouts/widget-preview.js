import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import { DynamicScriptLoader } from '@ea11y/components';
import { __ } from '@wordpress/i18n';

const WidgetPreview = () => {
	const handleScriptLoad = () => {
		console.log('External script loaded!');
	};

	const handleScriptError = () => {
		console.error('Failed to load the external script.');
	};
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
			<DynamicScriptLoader
				src="http://localhost:10058/wp-content/apps-a11y-widget/dist/widget.js"
				onLoad={handleScriptLoad}
				onError={handleScriptError}
			/>
		</>
	);
};

export default WidgetPreview;
