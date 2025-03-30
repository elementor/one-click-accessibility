const load = async () => {
	return new Promise((resolve, reject) => {
		const { scannerUrl, planData } = window?.ea11yScannerData;

		const scriptSrc = `${scannerUrl}?api_key=${planData?.public_api_key}`;

		// Check if script already exists
		if (document.querySelector(`script[src="${scriptSrc}"]`)) {
			return resolve(true); // Already loaded, resolve immediately
		}

		const script = document.createElement('script');
		script.src = scriptSrc;
		script.async = true;

		script.onload = () => {
			return resolve(true); // Resolve the promise
		};

		script.onerror = () => {
			return reject(new Error(`Failed to load script: ${scannerUrl}`)); // Reject the promise
		};

		document.body.appendChild(script);
	});
};

export const scannerWizard = {
	load,
};
