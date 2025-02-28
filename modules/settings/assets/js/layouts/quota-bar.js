import { EyeIcon, InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Infotip from '@elementor/ui/Infotip';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

const QuotaBar = () => {
	const usage = 12500;
	const quota = 12500;
	const calculatePlanUsage = () => {
		return (usage / quota) * 100;
	};
	const planUsage = calculatePlanUsage();
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
		<Box display="flex" flexDirection="row" alignItems="start" gap={2} p={2}>
			<EyeIcon />
			<Box display="inline-flex" flexDirection="column" gap={1} width="100%">
				<Typography
					variant="subtitle1"
					display="flex"
					alignItems="center"
					gap={1}
				>
					{__('Visits', 'pojo-accessibility')}
					<Infotip
						placement="right"
						content={__(
							'The number of visits to your website.',
							'pojo-accessibility',
						)}
					>
						<InfoCircleIcon
							sx={{
								fontSize: 'medium',
							}}
						/>
					</Infotip>
				</Typography>
				<LinearProgress
					sx={{
						'& .MuiLinearProgress-bar': {
							animation: 'none',
						},
						animation: 'none',
					}}
					value={planUsage}
					variant="buffer"
					color={progressBarColor()}
				/>
				<Typography variant="body2" color="text.tertiary">
					{`20K(${planUsage}%)`}
				</Typography>
				<Button
					variant="text"
					size="small"
					color="info"
					sx={{ justifyContent: 'flex-start', p: 0 }}
				>
					{__('Add visits', 'pojo-accessibility')}
				</Button>
			</Box>
		</Box>
	);
};

export default QuotaBar;
