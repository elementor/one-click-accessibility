import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const ManagementStats = () => {
	const { loading, remediations, globalRemediations } =
		useScannerWizardContext();

	const pageRemediationsActive = remediations?.filter((remediation) =>
		Number(remediation.active),
	).length;

	const globalRemediationsActive = globalRemediations.filter(
		({ active, active_for_page: activeForPage }) =>
			Number(active) && (!activeForPage || Number(activeForPage)),
	).length;

	const active = pageRemediationsActive + globalRemediationsActive;
	const total = remediations?.length + globalRemediations.length;

	const getStats = () =>
		active > 0 ? (
			<Typography variant="body2" color="text.secondary">
				{sprintf(
					// Translators: %1$s - active, %2$s - total
					__('%1$s/%2$s fixes are currently active', 'pojo-accessibility'),
					active,
					total,
				)}
			</Typography>
		) : (
			<Typography variant="body2" color="text.disabled">
				{__('0 fixes are currently active', 'pojo-accessibility')}
			</Typography>
		);

	return loading ? (
		<Box flexGrow={1} sx={{ py: 1 }}>
			<StyledSkeleton width="100%" height={14} />
		</Box>
	) : (
		getStats()
	);
};
