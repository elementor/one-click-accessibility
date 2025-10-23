import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import { DeleteButton } from '@ea11y-apps/scanner/components/manage-remediation-cta/delete-button';
import { DisableButton } from '@ea11y-apps/scanner/components/manage-remediation-cta/disable-button';
import { EnableButton } from '@ea11y-apps/scanner/components/manage-remediation-cta/enable-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const ManageRemediationButtons = () => {
	const { remediations } = useScannerWizardContext();

	const isAllDisabled =
		remediations.length > 0 &&
		remediations?.length ===
			remediations?.filter((remediation) => !Number(remediation.active))
				?.length;

	return (
		<Box display="flex" gap={1}>
			{isAllDisabled && (
				<>
					<DeleteButton />
					<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
				</>
			)}
			{isAllDisabled ? <EnableButton /> : <DisableButton />}
		</Box>
	);
};

export default ManageRemediationButtons;
