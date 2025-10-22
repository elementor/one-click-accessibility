import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import { DeleteButton } from '@ea11y-apps/scanner/components/manage-remediation-cta/delete-button';
import DisableGlobalRemediationMenu from '@ea11y-apps/scanner/components/manage-remediation-cta/disable-global-remediation-menu';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const ManageGlobalRemediationButtons = () => {
	const { globalRemediations } = useScannerWizardContext();
	const count = globalRemediations?.length;

	const isAllExcluded =
		count ===
		globalRemediations?.filter((remediation) => remediation.excluded)?.length;

	const isAllDisabled =
		count ===
		globalRemediations?.filter((remediation) => !Number(remediation.active))
			?.length;

	return (
		<Box display="flex" gap={1}>
			{isAllDisabled && (
				<>
					<DeleteButton />
					<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
				</>
			)}
			{isAllDisabled ? (
				<DisableGlobalRemediationMenu isAllExcluded={isAllExcluded} />
			) : (
				<DisableGlobalRemediationMenu isAllExcluded={isAllExcluded} />
			)}
		</Box>
	);
};

export default ManageGlobalRemediationButtons;
