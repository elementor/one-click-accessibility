import { InfoCircleIcon } from '@elementor/icons';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../../contexts/analytics-context';

const AnalyticsTooltip = () => {
	const { selectedMenu, setSelectedMenu } = useSettings();
	const { handleAnalyticsToggle } = useAnalyticsContext();

	const TooltipCard = (
		<Card elevation={0} sx={{ maxWidth: 300 }}>
			<CardHeader
				title={__('Enable tracking to unlock analytics', 'pojo-accessibility')}
			/>

			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{__(
						'Get valuable insights into how visitors interact with your accessibility widget.',
						'pojo-accessibility',
					)}
				</Typography>
			</CardContent>

			<CardActions>
				<Button
					size="small"
					variant="contained"
					color="info"
					tabIndex="0"
					onClick={() => {
						if ('analytics' !== selectedMenu) {
							setSelectedMenu('analytics');
							handleAnalyticsToggle();
						}
					}}
				>
					{__('Enable tracking', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);

	return (
		<Infotip placement="right" content={TooltipCard} tabIndex="0">
			<InfoCircleIcon color="info" sx={{ ml: 1 }} />
		</Infotip>
	);
};

export default AnalyticsTooltip;
