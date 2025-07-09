import RefreshIcon from '@elementor/icons/RefreshIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const ScanStats = () => {
	const { violation, results, resolved, loading, runNewScan } =
		useScannerWizardContext();
	const percent =
		violation !== 0 ? Math.min((resolved / violation) * 100, 100) : 100;
	const displayPercent = results ? Math.round(percent) : 0;

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
							{sprintf(
								// Translators: %1$s - resolved, %2$s - percent, %3$s - %
								__('%1$s Fixed (%2$s%3$s)', 'pojo-accessibility'),
								resolved,
								displayPercent,
								'%',
							)}
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
