import Button from '@elementor/ui/Button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const DisableButton = () => {
	const { remediations } = useScannerWizardContext();
	const { updateAllRemediationForPage } = useManageActions();
	return (
		<Button
			startIcon={<StyledBanIcon />}
			size="small"
			color="secondary"
			variant="text"
			onClick={updateAllRemediationForPage(false)}
			disabled={remediations.length < 1}
		>
			{__('Disable all', 'pojo-accessibility')}
		</Button>
	);
};
