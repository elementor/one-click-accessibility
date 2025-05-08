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
			wp_rest: window?.ea11ySettingsData?.wpRestNonce,
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

	static async clearSession() {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/connect/deactivate_and_disconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
				clear_session: true,
			},
		});
	}

	static async deactivateAndDisconnect() {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/connect/deactivate_and_disconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async deactivate() {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/connect/deactivate`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async disconnect() {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/connect/disconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async reconnect() {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/connect/reconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async getSettings() {
		return API.request({
			method: 'GET',
			path: `${wpV2Prefix}/settings`,
		});
	}

	static async updateSettings(data) {
		return API.request({
			method: 'PUT',
			path: `${wpV2Prefix}/settings`,
			data,
		});
	}

	static async addPage(data) {
		return API.request({
			method: 'POST',
			path: `${wpV2Prefix}/pages`,
			data,
		});
	}

	/**
	 * @return {Promise<any>} {}
	 */
	static async getPluginSettings() {
		return API.request({
			method: 'GET',
			path: `${v1Prefix}/settings/get-settings`,
		});
	}

	/**
	 * Go to connect service
	 * @return {Promise<void>} redirect
	 */
	static async redirectToConnect() {
		const link = await this.initConnect();
		window.open(link, '_self').focus();
	}

	/**
	 * Get data for analytic charts
	 * @param {Object} props
	 * @param {number} props.period
	 * @return {Promise<{Object}>} statistic
	 */
	static async getStatistic({ period }) {
		const path = addQueryArgs(`${v1Prefix}/analytics/statistic`, { period });
		return API.request({
			method: 'GET',
			path,
		});
	}

	/**
	 * @param {string} data URL string for the selected icon.
	 * @return {Promise<any>} {}
	 */
	static async getMedia(data) {
		return API.request({
			method: 'POST',
			path: `${v1Prefix}/settings/get-media`,
			data,
		});
	}

	static async getNotifications() {
		return API.request({
			method: 'GET',
			path: `${v1Prefix}/whats-new`,
		});
	}
}

export default API;
