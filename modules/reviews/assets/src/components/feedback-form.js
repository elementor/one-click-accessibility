import FormControl from '@elementor/ui/FormControl';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../hooks/use-settings';

const FeedbackForm = () => {
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
				value={feedback}
				color="secondary"
			/>
		</FormControl>
	);
};

export default FeedbackForm;

const StyledTextField = styled(TextField)`
	textarea:focus,
	textarea:active {
		outline: none;
		box-shadow: none;
	}
`;
