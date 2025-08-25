import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import { DeleteButton } from '@ea11y-apps/scanner/components/manage-remediation-buttons/delete-button';
import { DisableButton } from '@ea11y-apps/scanner/components/manage-remediation-buttons/disable-button';
import { EnableButton } from '@ea11y-apps/scanner/components/manage-remediation-buttons/enable-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

export const ManageRemediationButtons = () => {
	const { remediations } = useScannerWizardContext();

	const isAllDisabled =
		remediations?.length ===
		remediations?.filter((remediation) => !Number(remediation.active))?.length;

	return (
		<Box display="flex" gap={1}>
			{isAllDisabled ? <EnableButton /> : <DisableButton />}
			<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
			<DeleteButton />
		</Box>
	);
};
