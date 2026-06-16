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
import ThanksForm from '../components/thanks-form';
import { PAGE_IDS } from '../constants';
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
		const reviewData = window?.ea11yReviewData?.reviewData;

		if (!reviewData?.submitted || reviewData?.repo_review_clicked) {
			return;
		}

		setRating(reviewData.rating);
		setCurrentPage(PAGE_IDS.THANKS);
	}, [setCurrentPage, setRating]);

	useEffect(() => {
		if (isOpened) {
			mixpanelService.init().then(() => {
				mixpanelService.sendEvent(mixpanelEvents.review.promptShown, {});
			});
		}
	}, [isOpened]);

	const id = isOpened ? 'reviews-popover' : undefined;
	const isRTL = Boolean(window.ea11yReviewData?.isRTL);
	const horizontalOrigin = isRTL ? 'left' : 'right';
	const anchorPositionOffset = 10;

	const headerMessage = {
		[PAGE_IDS.RATINGS]: __(
			'How would you rate Web Accessibility so far?',
			'pojo-accessibility',
		),
		[PAGE_IDS.FEEDBACK]: __('What could we do better?', 'pojo-accessibility'),
		[PAGE_IDS.THANKS]: null,
	};

	return (
		<Popover
			open={isOpened}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: horizontalOrigin,
			}}
			anchorReference="anchorPosition"
			anchorPosition={{
				top: window.innerHeight - anchorPositionOffset,
				left: isRTL
					? anchorPositionOffset
					: window.innerWidth - anchorPositionOffset,
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: horizontalOrigin,
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
					<Typography
						variant="subtitle1"
						color="text.primary"
						marginBlockStart={1}
					>
						{headerMessage?.[currentPage]}
					</Typography>
				</Header>
				{PAGE_IDS.RATINGS === currentPage && <RatingForm />}
				{PAGE_IDS.FEEDBACK === currentPage && <FeedbackForm />}
				{PAGE_IDS.THANKS === currentPage && <ThanksForm />}
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
	margin-block-end: ${({ theme }) => theme.spacing(2)};
`;

const Footer = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'currentPage',
})`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	${({ currentPage, theme }) =>
		currentPage !== PAGE_IDS.FEEDBACK &&
		`border-block-start: 1px solid ${theme.palette.divider};`}
`;
