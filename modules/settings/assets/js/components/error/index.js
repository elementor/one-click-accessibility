import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import { __ } from '@wordpress/i18n';

const AlertError = () => {
	return (
		<Alert severity="error">
			<AlertTitle>
				{__('Something went wrong!', 'pojo-accessibility')}
			</AlertTitle>
		</Alert>
	);
};

export default AlertError;
