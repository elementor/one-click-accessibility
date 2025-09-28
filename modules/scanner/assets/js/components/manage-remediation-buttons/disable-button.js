import Button from '@elementor/ui/Button';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const DisableButton = () => {
	const { updateAllRemediationForPage } = useManageActions();
	return (
		<Button
			startIcon={<StyledBanIcon />}
			size="small"
			color="secondary"
			variant="text"
			onClick={updateAllRemediationForPage(false)}
		>
			{__('Disable all', 'pojo-accessibility')}
		</Button>
	);
};
