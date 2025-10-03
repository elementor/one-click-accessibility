import { BLOCKS, MANAGE_URL_PARAM } from '@ea11y-apps/scanner/constants';

export const getInitialTab = () => {
	const params = new URLSearchParams(window.location.search);
	const isInitManage = params.get(MANAGE_URL_PARAM) === '1';
	return isInitManage ? BLOCKS.management : BLOCKS.main;
};
