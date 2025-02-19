import { InfoCircleIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const AnalyticsToggle = () => {
	const { showAnalytics, updateShowAnalytics } = useAnalyticsContext();

	return (
		<Card variant="outlined" sx={{ mb: 4 }}>
			<StyledCardContent>
				<Box display="flex" gap={1} sx={{ mb: 1 }}>
					<Typography variant="subtitle1">
						{__('Want to see analytics ?', 'pojo-accessibility')}
					</Typography>
					<Infotip
						content={
							<Typography variant="body2" sx={{ p: 2 }}>
								{__('Want to see analytics ?', 'pojo-accessibility')}
							</Typography>
						}
						placement="right"
						arrow={true}
					>
						<InfoCircleIcon fontSize="small" />
					</Infotip>
				</Box>
				<Box>
					<FormControlLabel
						control={
							<Switch
								color="info"
								checked={showAnalytics}
								onChange={updateShowAnalytics}
							/>
						}
						label={__('Show analytics', 'pojo-accessibility')}
						labelPlacement="start"
						sx={{ ml: 0 }}
					/>
				</Box>
			</StyledCardContent>
		</Card>
	);
};

const StyledCardContent = styled(CardContent)`
	&:last-child {
		padding-bottom: 8px;
	}
`;
