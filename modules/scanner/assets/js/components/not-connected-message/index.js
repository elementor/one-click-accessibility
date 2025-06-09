import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import { useAuth } from '@ea11y-apps/global/hooks/use-auth';
import { NotConnectedImage } from '@ea11y-apps/scanner/images';
import {
	ReconnectDescription,
	StateContainer,
} from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const NotConnectedMessage = () => {
	const { redirectToConnect } = useAuth();

	return (
		<StateContainer>
			<NotConnectedImage />
			<Typography variant="subtitle1" color="text.secondary">
				{__('You may be logged in elsewhere', 'pojo-accessibility')}
			</Typography>
			<ReconnectDescription variant="body2" color="text.secondary">
				{__(
					"Check that you're using the right Ally account or reconnect now.",
					'pojo-accessibility',
				)}
			</ReconnectDescription>
			<Button
				size="small"
				color="info"
				variant="contained"
				onClick={redirectToConnect}
			>
				{__('Reconnect now', 'pojo-accessibility')}
			</Button>
		</StateContainer>
	);
};
