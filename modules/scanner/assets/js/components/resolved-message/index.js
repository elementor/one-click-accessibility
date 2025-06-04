import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ROOT_ID } from '@ea11y-apps/scanner/constants';
import { ResolvedImage } from '@ea11y-apps/scanner/images';
import {
	ResolvedButtonsBox,
	StateContainer,
} from '@ea11y-apps/scanner/styles/app.styles';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { __ } from '@wordpress/i18n';

export const ResolvedMessage = ({ setShowIssues }) => {
	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);
		closeWidget(widget);
	};

	return (
		<StateContainer>
			<ResolvedImage />
			<Box sx={{ maxWidth: '250px' }}>
				<Typography variant="body1" align="center">
					{__('Great job!', 'pojo-accessibility')}
				</Typography>
				<Typography variant="body1" align="center">
					{__(
						"You've resolved all accessibility issues on this page.",
						'pojo-accessibility',
					)}
				</Typography>
			</Box>
			<ResolvedButtonsBox>
				<Button
					size="small"
					variant="outlined"
					color="secondary"
					onClick={setShowIssues}
				>
					{__('Review fixes', 'pojo-accessibility')}
				</Button>
				<Button size="small" variant="contained" color="info" onClick={onClose}>
					{__('Finish', 'pojo-accessibility')}
				</Button>
			</ResolvedButtonsBox>
		</StateContainer>
	);
};

ResolvedMessage.propTypes = {
	setShowIssues: PropTypes.func.isRequired,
};
