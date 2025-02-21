import Alert from '@elementor/ui/Alert';
import AlertAction from '@elementor/ui/AlertAction';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const UrlMismatchNotice = () => {
	const { setShowMismatchModal } = useSettings();

	return (
		<Alert
			action={
				<AlertAction
					variant="outlined"
					onClick={() => setShowMismatchModal(true)}
				>
					{__('Fix mismatch URL', 'pojo-accessibility')}
				</AlertAction>
			}
			severity="error"
			square
		>
			{__(
				'Your license key does not match your current domain, causing a mismatch. This is most likely due to a change in the domain URL of your site.',
				'pojo-accessibility',
			)}
		</Alert>
	);
};

export default UrlMismatchNotice;
