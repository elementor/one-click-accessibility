import API from '@ea11y-apps/global/api/';

const v1Prefix = '/ea11y/v1';

class APIReview extends API {
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

export default APIReview;
