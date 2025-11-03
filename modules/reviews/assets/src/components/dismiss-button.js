import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import CloseButton from '@elementor/ui/CloseButton';
import { useStorage } from '@ea11y-apps/global/hooks';
import { date } from '@wordpress/date';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../hooks/use-settings';

const DismissButton = ({ variant = 'icon' }) => {
	const { save, get } = useStorage();
	const { currentPage, setIsOpened, handleClose, handleSubmit } = useSettings();
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

	if ('icon' === variant) {
		return <CloseButton onClick={handleDismiss} />;
	}

	if ('button' === variant) {
		return (
			<Box
				display="flex"
				flexDirection="row"
				gap={1}
				p={currentPage === 'feedback' ? 2 : 0}
				width="100%"
				justifyContent="end"
			>
				<Button
					color="secondary"
					variant="text"
					fullWidth={currentPage === 'feedback' ? false : true}
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
						onClick={() => handleSubmit(handleClose)}
						size="small"
					>
						{__('Submit', 'pojo-accessibility')}
					</Button>
				)}
			</Box>
		);
	}
};

export default DismissButton;
