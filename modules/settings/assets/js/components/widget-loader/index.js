import { useSettings } from '@ea11y/hooks';
import { useEffect } from '@wordpress/element';
import { WIDGET_PREVIEW_ROOT } from '../../constants';

const WidgetLoader = ({ src, onLoad, onError }) => {
	const { planData } = useSettings();

	useEffect(() => {
		const handleScriptLoad = () => {
			console.log('External script loaded!');
		};

		const handleScriptError = () => {
			console.error('Failed to load the external script.');
		};

		// Check if the script already exists
		const existingScript = document.querySelector(`script[src="${src}"]`);
		if (existingScript) {
			console.log(`Script with src "${src}" already loaded.`);
			return;
		}

		// Create a new script element
		const script = document.createElement('script');
		if (src) {
			script.src = src;
		} else {
			script.src = `${window?.ea11ySettingsData?.widgetUrl}?api_key=${planData?.public_api_key}`;
		}

		script.async = true;
		script.referrerPolicy = 'origin';

		// Attach onLoad and onError handlers
		script.onload = () => {
			console.log(`Script loaded successfully: ${script.src}`);
			if (onLoad) {
				onLoad();
			} else {
				handleScriptLoad();
			}
		};

		script.onerror = () => {
			console.error(`Failed to load script: ${script.src}`);
			if (onError) {
				onError();
			} else {
				handleScriptError();
			}
		};

		// Append the script to the document head
		document.head.appendChild(script);

		// Cleanup: Remove the script if the component unmounts
		return () => {
			if (document.getElementById(WIDGET_PREVIEW_ROOT)) {
				document.getElementById(WIDGET_PREVIEW_ROOT).remove();
			}
			document.head.removeChild(script);
			console.log(`Script removed: ${script.src}`);
		};
	}, [src, onLoad, onError]);

	return null;
};

export default WidgetLoader;
