import { useEffect } from '@wordpress/element';

const DynamicScriptLoader = ({ src, onLoad, onError }) => {
	useEffect(() => {
		// Check if the script already exists
		const existingScript = document.querySelector(`script[src="${src}"]`);
		if (existingScript) {
			console.log(`Script with src "${src}" already loaded.`);
			return;
		}

		// Create a new script element
		const script = document.createElement('script');
		script.src = src;
		script.async = true;

		// Attach onLoad and onError handlers
		script.onload = () => {
			console.log(`Script loaded successfully: ${src}`);
			if (onLoad) {
				onLoad();
				window?.ea11yWidget?.widget?.open();
			}
		};

		script.onerror = () => {
			console.error(`Failed to load script: ${src}`);
			if (onError) {
				onError();
			}
		};

		// Append the script to the document head
		document.head.appendChild(script);

		// Cleanup: Remove the script if the component unmounts
		return () => {
			document.head.removeChild(script);
			console.log(`Script removed: ${src}`);
		};
	}, [src, onLoad, onError]);

	return null;
};

export default DynamicScriptLoader;
