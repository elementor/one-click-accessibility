import API from '@ea11y-apps/global/api';
import { addQueryArgs } from '@wordpress/url';

const wpV2Prefix = '/wp/v2';
const v1Prefix = '/ea11y/v1';

class APISettings extends API {
	static async clearSession() {
		return APISettings.request({
			method: 'POST',
			path: `${v1Prefix}/connect/deactivate_and_disconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
				clear_session: true,
			},
		});
	}

	static async deactivate() {
		return APISettings.request({
			method: 'POST',
			path: `${v1Prefix}/connect/deactivate`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async disconnect() {
		return APISettings.request({
			method: 'POST',
			path: `${v1Prefix}/connect/disconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async reconnect() {
		return APISettings.request({
			method: 'POST',
			path: `${v1Prefix}/connect/reconnect`,
			data: {
				wp_rest: window?.ea11ySettingsData?.wpRestNonce,
			},
		});
	}

	static async addPage(data) {
		return APISettings.request({
			method: 'POST',
			path: `${wpV2Prefix}/pages`,
			data,
		});
	}

	/**
	 * @return {Promise<any>} {}
	 */
	static async getPluginSettings() {
		return APISettings.request({
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
		return APISettings.request({
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

	static async getPostTypes() {
		return API.request({
			method: 'GET',
			path: `${v1Prefix}/scanner/post-types`,
		});
	}

	static async getScannerStats(period) {
		const path = addQueryArgs(`${v1Prefix}/scanner/stats`, { period });

		return APISettings.request({
			method: 'GET',
			path,
		});
	}

	static async getScannerResults() {
		return APISettings.request({
			method: 'GET',
			path: `${v1Prefix}/scanner/results`,
		});
	}
}

export default APISettings;
