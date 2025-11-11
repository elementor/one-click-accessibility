import StarFilledIcon from '@elementor/icons/StarFilledIcon';
import FormControl from '@elementor/ui/FormControl';
import Rating from '@elementor/ui/Rating';
import Typography from '@elementor/ui/Typography';
import { useStorage } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { WORDPRESS_REVIEW_LINK } from '../constants';
import { useSettings } from '../hooks/use-settings';
import { MoodHappy } from '../icons';

const ReviewForm = () => {
	const { rating, handleClose } = useSettings();
	const { save, get } = useStorage();

	const handleSubmit = async () => {
		mixpanelService.sendEvent(mixpanelEvents.review.publicRedirectClicked, {
			rating: parseInt(rating),
			timestamp: new Date().toISOString(),
		});

		await save({
			ea11y_review_data: {
				...get.data.ea11y_review_data,
				repo_review_clicked: true,
			},
		});

		handleClose();
		window.open(WORDPRESS_REVIEW_LINK, '_blank');
	};

	return (
		<FormControl
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				textAlign: 'center',
			}}
			fullWidth
		>
			<MoodHappy
				sx={{
					p: 1.5,
					backgroundColor: '#f3f3f4',
					borderRadius: 2,
					fontSize: 24,
				}}
			/>
			<Typography variant="h6" marginBottom={1}>
				{__('Awesome!', 'pojo-accessibility')}
			</Typography>
			<Typography
				variant="body1"
				color="secondary"
				marginBottom={3}
				width="55%"
			>
				{__('Help others discover Ally on WordPress', 'pojo-accessibility')}
			</Typography>
			<Rating
				emptyIcon={<StarFilledIcon fontSize="large" />}
				icon={<StarFilledIcon fontSize="large" />}
				onChange={handleSubmit}
				sx={{ marginBottom: 3 }}
				highlightSelectedOnly={false}
			/>
		</FormControl>
	);
};

export default ReviewForm;
