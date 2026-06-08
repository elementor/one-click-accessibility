import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import CloseButton from '@elementor/ui/CloseButton';
import { useStorage } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { date } from '@wordpress/date';
import { __ } from '@wordpress/i18n';
import { SCHEDULING_LINK } from '../constants';
import { useSettings } from '../hooks/use-settings';

const DismissButton = ({ variant = 'icon' }) => {
	const { save, get } = useStorage();
	const {
		currentPage,
		rating,
		setIsOpened,
		setCurrentPage,
		handleClose,
		handleSubmit,
	} = useSettings();

	const handleDismiss = async () => {
		if (get.hasFinishedResolution) {
			await save({
				ea11y_review_data: {
					...get.data.ea11y_review_data,
					dismissals: get.data.ea11y_review_data.dismissals + 1,
					hide_for_days: get.data.ea11y_review_data.hide_for_days + 30,
					last_dismiss: date('Y-m-d H:i:s'),
				},
			});
		}

		setIsOpened(false);
	};

	const handleMaybeLater = async () => {
		mixpanelService.sendEvent(mixpanelEvents.review.callPromptDismissed, {
			rating: parseInt(rating),
		});

		await handleDismiss();
	};

	const handlePickATime = async () => {
		mixpanelService.sendEvent(mixpanelEvents.review.callScheduleClicked, {
			rating: parseInt(rating),
		});

		await save({
			ea11y_review_data: {
				...get.data.ea11y_review_data,
				repo_review_clicked: true,
			},
		});

		setIsOpened(false);
		window.open(SCHEDULING_LINK, '_blank');
	};

	const handleFeedbackSubmit = async () => {
		const submitted = await handleSubmit(handleClose, true);

		if (submitted) {
			setCurrentPage('thanks');
		}
	};

	if ('icon' === variant) {
		return <CloseButton onClick={handleDismiss} />;
	}

	const renderCallSchedulingButtons = () => (
		<>
			<Button
				color="secondary"
				variant="text"
				sx={{ p: 0.5 }}
				onClick={handleMaybeLater}
				size="small"
			>
				{__('Maybe later', 'pojo-accessibility')}
			</Button>
			<Button
				color="secondary"
				variant="contained"
				onClick={handlePickATime}
				size="small"
			>
				{__('Pick a time', 'pojo-accessibility')}
			</Button>
		</>
	);

	const renderFooterButtons = () => {
		if (currentPage === 'thanks') {
			return renderCallSchedulingButtons();
		}

		return (
			<>
				<Button
					color="secondary"
					variant="text"
					fullWidth={currentPage !== 'feedback'}
					sx={{ p: currentPage === 'feedback' ? 0.5 : 2 }}
					onClick={handleDismiss}
					size="small"
				>
					{__('Not now', 'pojo-accessibility')}
				</Button>
				{currentPage === 'feedback' && (
					<Button
						color="secondary"
						variant="contained"
						onClick={handleFeedbackSubmit}
						size="small"
					>
						{__('Submit', 'pojo-accessibility')}
					</Button>
				)}
			</>
		);
	};

	if ('button' === variant) {
		const isTwoButtonLayout =
			currentPage === 'feedback' || currentPage === 'thanks';

		return (
			<Box
				display="flex"
				flexDirection="row"
				gap={1}
				p={isTwoButtonLayout ? 2 : 0}
				width="100%"
				justifyContent="end"
			>
				{renderFooterButtons()}
			</Box>
		);
	}
};

export default DismissButton;
