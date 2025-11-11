import ReloadIcon from '@elementor/icons/ReloadIcon';
import Button from '@elementor/ui/Button';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { __ } from '@wordpress/i18n';

export const EnableButton = () => {
	const { updateAllRemediationForPage } = useManageActions();
	return (
		<Button
			startIcon={<ReloadIcon />}
			size="small"
			color="info"
			variant="text"
			onClick={updateAllRemediationForPage(true)}
		>
			{__('Enable all', 'pojo-accessibility')}
		</Button>
	);
};
