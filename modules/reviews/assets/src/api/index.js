import { APIBase } from '@ea11y/globals';

const v1Prefix = '/ea11y/v1';

class API extends APIBase {
	/**
	 * @param {Object} data
	 * @return {Promise<any>} result
	 */
	static async sendFeedback(data) {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/reviews/review`,
			data,
		});
	}
}

export default API;
