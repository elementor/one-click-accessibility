import Button from '@elementor/ui/Button';
import FormControl from '@elementor/ui/FormControl';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useStorage } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { WORDPRESS_REVIEW_LINK } from '../constants';
import { useSettings } from '../hooks/use-settings';

const ReviewForm = ({ close }) => {
	const { rating } = useSettings();
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

		close();
		window.open(WORDPRESS_REVIEW_LINK, '_blank');
	};

	return (
		<FormControl fullWidth>
			<Typography variant="body1" marginBottom={1}>
				{__(
					'It would mean a lot if you left us a quick review, so others can discover it too.',
					'pojo-accessibility',
				)}
			</Typography>
			<StyledButton
				color="secondary"
				variant="contained"
				onClick={handleSubmit}
			>
				{__('Leave a review', 'pojo-accessibility')}
			</StyledButton>
		</FormControl>
	);
};

export default ReviewForm;

const StyledButton = styled(Button)`
	min-width: 90px;
	align-self: flex-end;
`;
