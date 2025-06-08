import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import APIError from './exceptions/APIError';

const wpV2Prefix = '/wp/v2';
const v1Prefix = '/ea11y/v1';

class API {
	static async request({ path, data, method = 'POST' }) {
		try {
			if ('GET' === method && !path.startsWith(wpV2Prefix)) {
				path = addQueryArgs(path, { sb_time: new Date().getTime() });
			}

			const response = await apiFetch({
				path,
				method,
				data,
			});

			if (path.startsWith(wpV2Prefix)) {
				return response;
			}

			if (!response.success) {
				throw new APIError(response.data.message);
			}

			return response.data;
		} catch (e) {
			if (e instanceof APIError) {
				throw e;
			} else {
				throw new APIError(e.message);
			}
		}
	}

	static async initConnect(context = 'new') {
		const data = {
			wp_rest:
				window?.ea11ySettingsData?.wpRestNonce ||
				window?.ea11yScannerData?.wpRestNonce,
		};

		if ('update' === context) {
			data.update_redirect_uri = true;
		}

		return API.request({
			method: 'POST',
			path: `${v1Prefix}/connect/authorize`,
			data,
		});
	}
}

export default API;
