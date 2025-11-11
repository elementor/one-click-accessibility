import ManageGlobalActions from '@ea11y-apps/scanner/components/manage-footer-actions/global/manage-global-actions';
import ManagePageActions from '@ea11y-apps/scanner/components/manage-footer-actions/page/manage-page-actions';

const ManageFooterActions = ({ item, isActive }) => {
	return item.global === '1' ? (
		<ManageGlobalActions item={item} />
	) : (
		<ManagePageActions isActive={isActive} item={item} />
	);
};

export default ManageFooterActions;
