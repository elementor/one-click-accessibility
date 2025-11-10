import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import { DeleteButton } from '@ea11y-apps/scanner/components/manage-remediation-main-controls/page/delete-button';
import { DisableButton } from '@ea11y-apps/scanner/components/manage-remediation-main-controls/page/disable-button';
import { EnableButton } from '@ea11y-apps/scanner/components/manage-remediation-main-controls/page/enable-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const ManageRemediationControl = () => {
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

export default ManageRemediationControl;
