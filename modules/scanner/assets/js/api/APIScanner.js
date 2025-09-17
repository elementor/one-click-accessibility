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

	static async addScanResults(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/scanner/scan-results`,
			data,
		});
	}

	static async triggerSave(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/trigger-save`,
			data,
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
			path: `${v1Prefix}/remediation/item`,
			data,
		});
	}

	static async updateRemediation(data) {
		return APIScanner.request({
			method: 'PATCH',
			path: `${v1Prefix}/remediation/item`,
			data,
		});
	}

	static async updateRemediationContent(data) {
		return APIScanner.request({
			method: 'PUT',
			path: `${v1Prefix}/remediation/item`,
			data,
		});
	}

	static async deleteRemediation(data) {
		return APIScanner.request({
			method: 'DELETE',
			path: `${v1Prefix}/remediation/item`,
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

	static async resolveWithAI(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/scanner/resolve-with-ai`,
			data,
		});
	}

	static async resolveIssue(scanId) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/scanner/resolve-issue`,
			data: { scanId },
		});
	}

	static async getRemediations(url) {
		return APIScanner.request({
			method: 'GET',
			path: `${v1Prefix}/remediation/items?url=${encodeURIComponent(url)}`,
		});
	}

	static async updateRemediationStatusForPage(data) {
		return APIScanner.request({
			method: 'PATCH',
			path: `${v1Prefix}/remediation/items`,
			data,
		});
	}

	static async deleteRemediationForPage(data) {
		return APIScanner.request({
			method: 'DELETE',
			path: `${v1Prefix}/remediation/items`,
			data,
		});
	}

	static async setHeadingLevel(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/heading-level`,
			data,
		});
	}

	static async dismissHeadingIssue(data) {
		return APIScanner.request({
			method: 'POST',
			path: `${v1Prefix}/remediation/dismiss-heading-issue`,
			data,
		});
	}

	static async clearCache(data) {
		return APIScanner.request({
			method: 'DELETE',
			path: `${v1Prefix}/remediation/clear-cache`,
			data,
		});
	}
}
