import * as z from 'zod';

const ScannerSettings = z.object({
	wpRestNonce: z.string(),
	dashboardUrl: z.url(),
	scannerUrl: z.url(),
	initialScanResult: z.object({
		url: z.url(),
		counts: z.object({
			issuesResolved: z.int(),
			manual: z.int(),
			pass: z.int(),
			potentialRecommendation: z.int(),
			potentialViolation: z.int(),
			recommendation: z.int(),
			violation: z.int(),
		}),
	}),
	pageData: z.object({
		entry_id: z.string(),
		object_id: z.int(),
		object_type: z.string(),
		object_type_name: z.string(),
		title: z.string(),
		unregistered: z.boolean(),
		url: z.url(),
	}),
	dismissedHeadingIssues: z.array(z.string()),
	isConnected: z.string(),
	isRTL: z.string(),
});

const useScannerSettings = () => {
	const validationResult = ScannerSettings.safeParse(window.ea11yScannerData);

	if (!validationResult.success) {
		console.error(
			'Ea11y scanner: Validation error of `window.ea11yScannerData`',
			validationResult.error.issues,
		);
	}

	if (!window.ea11yScannerData) {
		window.ea11yScannerData = {};
	}

	if (!window.ea11yScannerData.dismissedHeadingIssues) {
		window.ea11yScannerData.dismissedHeadingIssues = [];
	}

	if (!window.ea11yScannerData.pageData) {
		window.ea11yScannerData.pageData = {};
	}

	return window.ea11yScannerData;
};

export default useScannerSettings;
