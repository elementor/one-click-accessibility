import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import PlayerStopIcon from '@ea11y-apps/scanner/icons/player-stop-icon';
import { __, sprintf } from '@wordpress/i18n';

const GeneratingProgress = ({ progress, onStop }) => {
	const progressText = sprintf(
		// Translators: %1$d current count, %2$d total count
		__('%1$d/%2$d completed', 'pojo-accessibility'),
		progress.completed,
		progress.total,
	);

	return (
		<Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
			<LinearProgress
				value={
					progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
				}
				variant="determinate"
				color="info"
				sx={{ flexGrow: 1 }}
				aria-label={__('Generation progress', 'pojo-accessibility')}
			/>
			<Alert
				severity="info"
				variant="standard"
				icon={false}
				secondaryAction={
					<Typography
						variant="body2"
						color="text.secondary"
						role="status"
						aria-live="polite"
						aria-atomic="true"
						alignSelf="center"
					>
						{progressText}
					</Typography>
				}
				action={
					<Button
						color="info"
						variant="outlined"
						size="small"
						onClick={onStop}
						startIcon={<PlayerStopIcon />}
					>
						{__('Stop', 'pojo-accessibility')}
					</Button>
				}
			>
				<AlertTitle>
					{__('Generating alt text for images…', 'pojo-accessibility')}
				</AlertTitle>
			</Alert>
		</Box>
	);
};

GeneratingProgress.propTypes = {
	progress: PropTypes.shape({
		completed: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
	}).isRequired,
	onStop: PropTypes.func.isRequired,
};

export default GeneratingProgress;
