import API from '@ea11y-apps/global/api';

const v1Prefix = '/ea11y/v1';

export class APIScanner extends API {
	static async registerPage() {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/register`,
			data: {
				...window?.ea11yScannerData?.pageData,
				wp_rest: window?.ea11yScannerData?.wpRestNonce,
			},
		});
	}

	static async submitAltText(url, text) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/set-alt-text`,
			data: {
				url,
				alt_text: text,
				wp_rest: window?.ea11yScannerData?.wpRestNonce,
			},
		});
	}

	static async generateAltText(image) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/scanner/generate-alt-text`,
			data: {
				image,
				wp_rest: window?.ea11yScannerData?.wpRestNonce,
			},
		});
	}
}
