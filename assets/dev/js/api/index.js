import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import APIError from './exceptions/APIError';

const wpV2Prefix = '/wp/v2';
const v1Prefix = '/ea11y/v1';

class API {
	static async request({ path, data, method = 'POST', headers }) {
		try {
			if ('GET' === method && !path.startsWith(wpV2Prefix)) {
				path = addQueryArgs(path, { sb_time: new Date().getTime() });
			}

			const response = await apiFetch({
				path,
				method,
				data,
				headers,
			});

			if (path.startsWith(wpV2Prefix)) {
				return response;
			}

			if (!response.success) {
				throw new APIError(
					response.data.message,
					response.data.code,
					response.data,
				);
			}

			return response.data;
		} catch (e) {
			if (e instanceof APIError) {
				throw e;
			}

			// apiFetch throws an error with code and message at root level
			// when WordPress REST API returns a WP_Error
			// WordPress REST API error structure: { code, message, data }
			throw new APIError(e.message, e.code, e.data);
		}
	}

	static async initConnect(context = 'new') {
		const data = {
			wp_rest:
				window?.ea11ySettingsData?.wpRestNonce ||
				window?.ea11yScannerData?.wpRestNonce,
		};

		const path = `${v1Prefix}/connect/${'update' === context ? 'switch-domain' : 'authorize'}`;

		return API.request({
			method: 'POST',
			path,
			data,
		});
	}
}

export default API;
