import { DialogContentText, DialogHeaderGroup } from '@elementor/ui';
import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const AnalyticsToggle = () => {
	const { showAnalytics, updateShowAnalytics } = useAnalyticsContext();
	const [showConfirm, setShowConfirm] = useState(false);

	const handleToggle = () => {
		if (showAnalytics) {
			updateShowAnalytics();
		} else {
			setShowConfirm(true);
		}
	};

	const handleClose = () => setShowConfirm(false);
	const handleConfirm = () => {
		updateShowAnalytics();
		setShowConfirm(false);
	};

	return (
		<>
			<FormControlLabel
				control={
					<Switch
						color="info"
						checked={showAnalytics}
						onChange={handleToggle}
						sx={{ ml: 2 }}
					/>
				}
				label={__('Track widget data', 'pojo-accessibility')}
				labelPlacement="start"
				sx={{ ml: 0 }}
			/>
			<Dialog
				open={showConfirm}
				onClose={handleClose}
				aria-labelledby="confirm-enable-analytics-title"
				aria-describedby="confirm-enable-analytics-description"
			>
				<DialogHeader onClose={handleClose}>
					<DialogHeaderGroup>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeaderGroup>
				</DialogHeader>

				<DialogContent>
					<Typography variant="h5" align="center" sx={{ mb: 3 }}>
						{__('Confirm tracking data', 'pojo-accessibility')}
					</Typography>
					<DialogContentText
						id="confirm-enable-analytics-description"
						align="center"
					>
						{__(
							'Text about how users confirm to track data, and that their database can support all the writes if they have a site with heavy traffic',
							'pojo-accessibility',
						)}
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						{__('Close', 'pojo-accessibility')}
					</Button>
					<Button onClick={handleConfirm} variant="contained" color="info">
						{__('Confirm', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
