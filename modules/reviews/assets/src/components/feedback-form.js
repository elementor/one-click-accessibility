import Button from '@elementor/ui/Button';
import FormControl from '@elementor/ui/FormControl';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../hooks/use-settings';

const FeedbackForm = ({ close, handleSubmitForm }) => {
	const { feedback, setFeedback } = useSettings();

	return (
		<FormControl fullWidth>
			<StyledTextField
				onChange={(e) => setFeedback(e.target.value)}
				minRows={5}
				multiline
				placeholder={__(
					'Share your thoughts on how we can improve Ally …',
					'pojo-accessibility',
				)}
				sx={{ marginBottom: 2 }}
				value={feedback}
				color="secondary"
			/>
			<StyledButton
				color="secondary"
				variant="contained"
				onClick={() => handleSubmitForm(close)}
			>
				{__('Submit', 'pojo-accessibility')}
			</StyledButton>
		</FormControl>
	);
};

export default FeedbackForm;

const StyledButton = styled(Button)`
	min-width: 80px;
	align-self: flex-end;
`;

const StyledTextField = styled(TextField)`
	textarea:focus,
	textarea:active {
		outline: none;
		box-shadow: none;
	}
`;
