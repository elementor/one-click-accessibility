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
}
