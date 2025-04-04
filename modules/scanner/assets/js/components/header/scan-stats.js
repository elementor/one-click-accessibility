import {
	ColorBlue600,
	ColorBlue200,
} from '@elementor/design-tokens/primitives';
import RefreshIcon from '@elementor/icons/RefreshIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { __ } from '@wordpress/i18n';

export const ScanStats = () => {
	const { results, resolved, getResults } = useScannerWizardContext();
	const violation = results?.summary?.counts?.violation;
	const percent = violation !== 0 ? (violation / 100) * resolved : 100;
	const displayPercent = results ? Math.round(percent) : 0;
	console.log(results);
	return (
		<Box>
			<Box display="flex" gap="12px">
				<StyledLegend legendColor={ColorBlue200}>
					<Typography variant="subtitle2" sx={{ mr: '4px' }}>
						{results ? violation : ''}
					</Typography>
					<Typography variant="body2">
						{__('Total Issues', 'pojo-accessibility')}
					</Typography>
				</StyledLegend>
				<StyledLegend legendColor={ColorBlue600}>
					<Typography variant="subtitle2" sx={{ mr: '4px' }}>
						{resolved}
					</Typography>
					<Typography variant="body2">
						{__('Solved', 'pojo-accessibility')}
					</Typography>
				</StyledLegend>
			</Box>
			<Box display="flex" gap="12px" alignItems="center">
				<Typography variant="subtitle2">{displayPercent}%</Typography>
				<LinearProgress
					color="info"
					sx={{
						'& .MuiLinearProgress-bar': {
							animation: 'none',
						},
						'& .MuiLinearProgress-bar1Determinate': {
							backgroundColor: ColorBlue600,
						},
						backgroundColor: ColorBlue200,
						animation: 'none',
						flexGrow: 1,
					}}
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
					{__('Scan Again', 'pojo-accessibility')}
				</Button>
			</Box>
		</Box>
	);
};

const StyledLegend = styled(Box, {
	shouldForwardProp: (props) => props !== 'legendColor',
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
		background-color: ${(props) => props.legendColor};
	}
`;
