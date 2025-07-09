import API from '@ea11y-apps/global/api';
import { GOLINKS } from '@ea11y-apps/global/constants';

export const useAuth = () => {
	const { subscriptionId } = 123;

	const redirectToConnect = async () => {
		const link = await getConnectLink();

		window.open(link, '_self').focus();
	};

	const getConnectLink = async () => {
		return API.initConnect();
	};

	const getUpgradeLink = () => {
		const url = new URL(GOLINKS.UPGRADE);

		url.searchParams.append('subscription_id', subscriptionId);

		return url.toString();
	};

	return {
		redirectToConnect,
		getConnectLink,
		getUpgradeLink,
	};
};
