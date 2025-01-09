import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import { DynamicScriptLoader } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { WIDGET_URL } from '../constants';

const WidgetPreview = () => {
	const { planData } = useSettings();
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
				src={`${WIDGET_URL}?api_key=${planData?.public_api_key}`}
				onLoad={handleScriptLoad}
				onError={handleScriptError}
			/>
		</>
	);
};

export default WidgetPreview;
