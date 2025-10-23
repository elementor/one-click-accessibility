import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { useSettings } from '@ea11y/hooks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../../contexts/analytics-context';

const AnalyticsTooltip = () => {
	const { setSelectedMenu } = useSettings();
	const { handleAnalyticsToggle, isAnalyticsEnabled } = useAnalyticsContext();
	const [isOpen, setIsOpen] = useState(false);

	// Don't show tooltip if analytics is already enabled
	if (isAnalyticsEnabled) {
		return null;
	}

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleEnableTracking = () => {
		// Execute the analytics functionality
		setSelectedMenu('analytics');
		handleAnalyticsToggle();
		// Close the tooltip
		handleClose();
	};

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
					onClick={handleEnableTracking}
				>
					{__('Enable tracking', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);

	return (
		<Infotip
			placement="right"
			content={TooltipCard}
			tabIndex="0"
			open={isOpen}
			onClose={handleClose}
			disableHoverListener={false}
			disableFocusListener={false}
		>
			<InfoCircleIcon
				color="info"
				sx={{ ml: 1 }}
				onMouseEnter={handleOpen}
				onFocus={handleOpen}
			/>
		</Infotip>
	);
};

export default AnalyticsTooltip;
