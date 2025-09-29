import RefreshIcon from '@elementor/icons/RefreshIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { injectTemplateVars } from '@ea11y-apps/global/utils/inject-template-vars';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const ScanStats = () => {
	const { violation, results, resolved, loading, runNewScan } =
		useScannerWizardContext();
	const percent =
		violation !== 0 ? Math.min((resolved / violation) * 100, 100) : 100;
	const displayPercent = results ? Math.round(percent) : 0;
	const statsText = sprintf(
		// Translators: %1$s - resolved, %2$s - percent
		__('%1$s Fixed {{lightGrey}}(%2$s%%){{/lightGrey}}', 'pojo-accessibility'),
		resolved,
		displayPercent,
	);

	return (
		<Box>
			<Box display="flex" gap={1.5} alignItems="center">
				{loading ? (
					<Box flexGrow={1} sx={{ py: 1 }}>
						<StyledSkeleton width="100%" height={14} />
					</Box>
				) : (
					<>
						<Typography variant="body2" color="text.secondary">
							{injectTemplateVars(statsText, {
								lightGrey: ({ children }) => (
									<Typography as="span" variant="body2" color="text.tertiary">
										{children}
									</Typography>
								),
							})}
						</Typography>

						<StyledLinearProgress
							color="success"
							value={displayPercent}
							variant="determinate"
							role="presentation"
						/>

						<Button
							variant="outlined"
							size="small"
							color="secondary"
							endIcon={<RefreshIcon />}
							onClick={runNewScan}
						>
							{__('New Scan', 'pojo-accessibility')}
						</Button>
					</>
				)}
			</Box>
		</Box>
	);
};

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
	'& .MuiLinearProgress-bar': {
		animation: 'none',
	},
	'& .MuiLinearProgress-bar1Determinate': {
		backgroundColor: theme.palette.success.light,
	},
	backgroundColor: theme.palette.grey['50'],
	animation: 'none',
	flexGrow: 1,
}));
