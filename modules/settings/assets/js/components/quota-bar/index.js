import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import LockFilledIcon from '@elementor/icons/LockFilledIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { QuotaBarData } from '@ea11y/components/quota-bar/data';
import { formatPlanValue } from '../../utils/index';

const QuotaBar = ({ type, quotaData }) => {
	const planUsage =
		quotaData?.allowed === 0
			? 0
			: Math.round((quotaData?.used / quotaData?.allowed) * 100);
	const isLocked = quotaData?.allowed === 0;

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
					color={!isLocked ? 'text.secondary' : 'text.disabled'}
					display="flex"
					alignItems="center"
					sx={{ fontSize: '12px' }}
				>
					{QuotaBarData[type]?.title}
					<Infotip
						placement="right"
						PopperProps={{
							sx: { width: '300px', marginLeft: 1 },
							disablePortal: true,
						}}
						content={
							<Typography color="text.secondary" variant="body2" padding={2}>
								{!isLocked
									? QuotaBarData[type]?.infotipDescription
									: QuotaBarData[type]?.lockedDescription}
							</Typography>
						}
					>
						{!isLocked ? (
							<InfoCircleIcon
								sx={{
									fontSize: 'medium',
								}}
							/>
						) : (
							<LockFilledIcon
								sx={{ fontSize: 'medium', color: 'text.primary', opacity: 0.5 }}
							/>
						)}
					</Infotip>
				</Typography>
				<Box display="flex" flexDirection="row" gap={0.5} alignItems="center">
					<Typography
						variant="body2"
						color={!isLocked ? 'text.primary' : 'text.disabled'}
						sx={{ fontSize: '12px' }}
					>
						{!isLocked
							? `${formatPlanValue(quotaData?.used)} / ${formatPlanValue(quotaData?.allowed)}`
							: '0/0'}
					</Typography>
				</Box>
			</Box>
			<LinearProgress
				sx={{
					'& .MuiLinearProgress-bar': {
						animation: 'none',
						backgroundColor: isLocked && 'text.disabled',
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
