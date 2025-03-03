import Alert from '@elementor/ui/Alert';
import AlertAction from '@elementor/ui/AlertAction';
import { UrlMismatchModal } from '@ea11y/components';
import { useModal } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { usePluginSettingsContext } from '../../contexts/plugin-settings';

const UrlMismatchNotice = () => {
	const { isUrlMismatch } = usePluginSettingsContext();
	const { open, close, isOpen } = useModal(false);

	return (
		<>
			<Alert
				action={
					<AlertAction variant="outlined" onClick={open}>
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
			{isUrlMismatch && <UrlMismatchModal open={isOpen} close={close} />}
		</>
	);
};

export default UrlMismatchNotice;
