import CloseButton from '@elementor/ui/CloseButton';
import { useStorage } from '@ea11y-apps/global/hooks';
import { date } from '@wordpress/date';
import { useSettings } from '../hooks/use-settings';

const DismissButton = () => {
	const { save, get } = useStorage();
	const { setIsOpened } = useSettings();
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
	return <CloseButton onClick={handleDismiss} />;
};

export default DismissButton;
