import API from '@ea11y-apps/global/api';

const v1Prefix = '/ea11y/v1';

export class APIScanner extends API {
	static async registerPage(pageData, summary) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/register`,
			data: {
				...pageData,
				summary,
			},
		});
	}

	static async addScanResults(url, summary) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/scanner/scan-results`,
			data: {
				url,
				summary,
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
			},
		});
	}

	static async submitRemediation(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/add-remediation`,
			data,
		});
	}

	static async generateAltText(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/scanner/generate-alt-text`,
			data,
		});
	}
}
