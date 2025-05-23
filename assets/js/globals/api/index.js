import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import APIError from './exceptions/APIError';

const wpV2Prefix = '/wp/v2';

class APIBase {
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
}

export default APIBase;
