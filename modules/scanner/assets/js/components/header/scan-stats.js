import RefreshIcon from '@elementor/icons/RefreshIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const ScanStats = () => {
	const { results, resolved, loading, getResults } = useScannerWizardContext();
	const violation = results?.summary?.counts?.violation;
	const percent = violation !== 0 ? (resolved / violation) * 100 : 100;
	const displayPercent = results ? Math.round(percent) : 0;

	return (
		<Box>
			<Box display="flex" gap="12px">
				<StyledLegend loading={loading}>
					<Typography variant="subtitle2" sx={{ mr: '4px' }}>
						{resolved}
					</Typography>
					<Typography variant="body2">
						{__('Resolved', 'pojo-accessibility')}
					</Typography>
				</StyledLegend>
			</Box>
			<Box display="flex" gap="12px" alignItems="center">
				<Typography variant="subtitle2">{displayPercent}%</Typography>
				{loading ? (
					<Box flexGrow={1} sx={{ py: 1.5 }}>
						<StyledSkeleton width="100%" height={12} />
					</Box>
				) : (
					<>
						<StyledLinearProgress
							color="success"
							value={displayPercent}
							variant="determinate"
						/>
						<Button
							variant="outlined"
							size="small"
							color="secondary"
							endIcon={<RefreshIcon />}
							onClick={getResults}
						>
							{__('New Scan', 'pojo-accessibility')}
						</Button>
					</>
				)}
			</Box>
		</Box>
	);
};

const StyledLegend = styled(Box, {
	shouldForwardProp: (props) => props !== 'loading',
})`
	position: relative;
	display: flex;
	align-items: center;
	padding-left: 14px;
	&:before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		display: block;
		width: 8px;
		height: 8px;
		background-color: ${({ theme, loading }) =>
			loading ? theme.palette.grey['50'] : theme.palette.success.light};
	}
`;

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
