import { InfoCircleIcon } from '@elementor/icons';
import { styled } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { QuotaBarData } from '@ea11y/components/quota-bar/data';
import { formatPlanValue } from '../../utils/index';

const QuotaBar = ({ type, quotaData }) => {
	const planUsage = Math.round((quotaData?.used / quotaData?.allowed) * 100);

	/**
	 * Get the color for the progress bar based on the usage.
	 * @return {string} The color for the progress bar.
	 */
	const progressBarColor = () => {
		if (planUsage < 80) {
			return 'info';
		}
		if (planUsage >= 80 && planUsage < 95) {
			return 'warning';
		}
		return 'error';
	};

	return (
		<StyledOuterWrapper>
			<Box display="flex" justifyContent="space-between">
				<Typography
					variant="body2"
					color="text.secondary"
					display="flex"
					alignItems="center"
					sx={{ fontSize: '12px' }}
				>
					{QuotaBarData[type]?.title}
					<Infotip
						placement="right"
						PopperProps={{ sx: { width: '300px' }, disablePortal: true }}
						content={
							<Typography
								color="text.primary"
								variant="body2"
								padding={2}
								fontSize={16}
							>
								{QuotaBarData[type]?.infotipDescription}
							</Typography>
						}
					>
						<InfoCircleIcon
							sx={{
								fontSize: 'medium',
							}}
						/>
					</Infotip>
				</Typography>
				{quotaData?.allowed && (
					<Box display="flex" flexDirection="row" gap={0.5} alignItems="center">
						<Typography
							variant="body2"
							color="text.primary"
							sx={{ fontSize: '12px' }}
						>
							{formatPlanValue(quotaData?.used)}/
							{formatPlanValue(quotaData?.allowed)}
						</Typography>
					</Box>
				)}
			</Box>
			<LinearProgress
				sx={{
					'& .MuiLinearProgress-bar': {
						animation: 'none',
					},
					animation: 'none',
				}}
				value={planUsage}
				variant="buffer"
				valueBuffer={100}
				color={progressBarColor()}
			/>
		</StyledOuterWrapper>
	);
};

export default QuotaBar;

const StyledOuterWrapper = styled(Box)`
	display: inline-flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1)};
	width: 100%;
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
