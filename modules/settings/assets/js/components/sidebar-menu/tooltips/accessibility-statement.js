import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const AccessibilityStatementTooltip = () => {
	const { selectedMenu, setSelectedMenu, accessibilityStatementData } =
		useSettings();

	if (accessibilityStatementData?.link) {
		return null;
	}

	const TooltipCard = (
		<Card elevation={0} sx={{ maxWidth: 300 }}>
			<CardHeader
				title={__('Accessibility statement generator', 'pojo-accessibility')}
			/>

			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{__(
						'Create your accessibility statement and page in seconds, reflecting your ongoing commitment to an accessible site.',
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
						if ('accessibility-statement' !== selectedMenu) {
							setSelectedMenu('accessibility-statement');
						}
					}}
				>
					{__('Take me there', 'pojo-accessibility')}
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

export default AccessibilityStatementTooltip;
