import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const ManagementStats = () => {
	const { loading, remediations } = useScannerWizardContext();

	return loading ? (
		<Box flexGrow={1} sx={{ py: 1 }}>
			<StyledSkeleton width="100%" height={14} />
		</Box>
	) : (
		<Typography variant="body2" color="text.secondary">
			{sprintf(
				// Translators: %1$s - active, %2$s - total
				__('%1$s/%2$s fixes are currently active', 'pojo-accessibility'),
				remediations?.filter((remediation) => Number(remediation.active))
					.length,
				remediations?.length,
			)}
		</Typography>
	);
};
