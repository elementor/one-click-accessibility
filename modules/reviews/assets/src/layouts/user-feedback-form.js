import Box from '@elementor/ui/Box';
import Popover from '@elementor/ui/Popover';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import DismissButton from '../components/dismiss-button';
import FeedbackForm from '../components/feedback-form';
import RatingForm from '../components/rating-form';
import ReviewForm from '../components/review-form';
import { useSettings } from '../hooks/use-settings';

const UserFeedbackForm = () => {
	const anchorEl = useRef(null);
	const {
		setRating,
		isOpened,
		currentPage,
		setCurrentPage,
		handleClose,
		handleSubmit,
	} = useSettings();

	useEffect(() => {
		/**
		 * Show the popover if the user has not submitted repo feedback.
		 */
		if (
			window?.ea11yReviewData?.reviewData?.rating > 3 &&
			!window?.ea11yReviewData?.reviewData?.repo_review_clicked
		) {
			setCurrentPage('review');
			setRating(window?.ea11yReviewData?.reviewData?.rating); // re-add the saved rating
		}
	}, []);

	useEffect(() => {
		if (isOpened) {
			mixpanelService.init().then(() => {
				mixpanelService.sendEvent(mixpanelEvents.review.promptShown, {});
			});
		}
	}, [isOpened]);

	const id = isOpened ? 'reviews-popover' : undefined;

	const headerMessage = {
		ratings: __('How would you rate Ally so far?', 'pojo-accessibility'),
		feedback: __(
			'We’re thrilled to hear that! What would make it even better?',
			'pojo-accessibility',
		),
		review: null,
	};

	return (
		<Popover
			open={isOpened}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			anchorReference="anchorPosition"
			anchorPosition={{
				top: window.innerHeight - 10,
				left: window.innerWidth - 10,
			}}
			id={id}
			onClose={handleClose}
			anchorEl={anchorEl.current}
			disableEscapeKeyDown
			disableScrollLock
			disablePortal
			slotProps={{
				paper: {
					sx: {
						pointerEvents: 'auto', // allow interactions inside popover
					},
				},
			}}
			sx={{
				pointerEvents: 'none', // allow click-through behind
			}}
		>
			<StyledBox>
				<Header>
					<Typography variant="subtitle1" color="text.primary" marginTop={1}>
						{headerMessage?.[currentPage]}
					</Typography>
				</Header>
				{'ratings' === currentPage && <RatingForm />}
				{'feedback' === currentPage && <FeedbackForm />}
				{'review' === currentPage && <ReviewForm />}
			</StyledBox>
			<Footer currentPage={currentPage}>
				<DismissButton
					variant="button"
					close={handleClose}
					handleSubmit={handleSubmit}
				/>
			</Footer>
		</Popover>
	);
};

export default UserFeedbackForm;

const StyledBox = styled(Box)`
	width: 350px;
	padding: ${({ theme }) => theme.spacing(1.5)};
`;

const Header = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Footer = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	${({ currentPage, theme }) =>
		currentPage !== 'feedback' &&
		`border-top: 1px solid ${theme.palette.divider};`}
`;
