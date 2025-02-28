import { EyeIcon, InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Infotip from '@elementor/ui/Infotip';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { ADD_VISITS_LINK } from '../constants/index';
import { openLink } from '../utils';

const QuotaBar = () => {
	const { planUsage } = useSettings();

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
		<StyledBox>
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
					valueBuffer={100}
					color={progressBarColor()}
				/>
				<Typography variant="body2" color="text.tertiary">
					{`20K(${planUsage}%)`}
				</Typography>
				<StyledButton
					variant="text"
					size="small"
					color="info"
					onClick={() => openLink(ADD_VISITS_LINK)}
				>
					{__('Add visits', 'pojo-accessibility')}
				</StyledButton>
			</Box>
		</StyledBox>
	);
};

export default QuotaBar;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: start;
	gap: ${({ theme }) => theme.spacing(2)};
	margin: ${({ theme }) => theme.spacing(2)};
	padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledButton = styled(Button)`
	justify-content: flex-start;
	padding: 0;
	:hover {
		background: none;
	}
`;
