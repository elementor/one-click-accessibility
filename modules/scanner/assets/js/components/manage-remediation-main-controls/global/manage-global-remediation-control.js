import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import DeleteGlobalButton from '@ea11y-apps/scanner/components/manage-remediation-main-controls/global/delete-global-button';
import GlobalRemediationControlMenu from '@ea11y-apps/scanner/components/manage-remediation-main-controls/global/global-remediation-control-menu';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const ManageGlobalRemediationControl = () => {
	const { globalRemediations } = useScannerWizardContext();
	const count = globalRemediations?.length;

	const isAllExcluded =
		count ===
		globalRemediations?.filter(
			(remediation) => !Number(remediation.active_for_page),
		)?.length;

	const isAllDisabled =
		count ===
		globalRemediations?.filter((remediation) => !Number(remediation.active))
			?.length;

	return (
		<Box display="flex" gap={1}>
			{isAllExcluded && isAllDisabled && (
				<>
					<DeleteGlobalButton />
					<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
				</>
			)}
			<GlobalRemediationControlMenu
				isAllExcluded={isAllExcluded}
				isAllDisabled={isAllDisabled}
			/>
		</Box>
	);
};

export default ManageGlobalRemediationControl;
