import FormControl from '@elementor/ui/FormControl';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../hooks/use-settings';
import { MoodHappy, MoodSad } from '../icons';

const ThanksForm = () => {
	const { rating } = useSettings();
	const isPositiveRating = parseInt(rating, 10) >= 4;

	return (
		<StyledFormControl fullWidth>
			{isPositiveRating ? <StyledMoodHappy /> : <StyledMoodSad />}

			<Typography
				variant="subtitle1"
				component="h2"
				marginBlockEnd={1}
				marginBlockStart={1}
			>
				{isPositiveRating
					? __("Thanks, that's great to hear!", 'pojo-accessibility')
					: __('Thanks for letting us know', 'pojo-accessibility')}
			</Typography>

			<Typography
				variant="body1"
				color="secondary"
				marginBlockEnd={3}
				width="70%"
			>
				{isPositiveRating
					? __(
							'Help us make Web Accessibility even better. Open to a quick call?',
							'pojo-accessibility',
						)
					: __(
							'We regularly chat with Web Accessibility users to learn and improve. Open to a quick call?',
							'pojo-accessibility',
						)}
			</Typography>
		</StyledFormControl>
	);
};

export default ThanksForm;

const StyledFormControl = styled(FormControl)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};
	text-align: center;
`;

const StyledMoodHappy = styled(MoodHappy)`
	padding: ${({ theme }) => theme.spacing(1.5)};
	background-color: #f3f3f4;
	border-radius: ${({ theme }) => theme.spacing(2)};
	font-size: 24px;
`;

const StyledMoodSad = styled(MoodSad)`
	padding: ${({ theme }) => theme.spacing(1.5)};
	background-color: #f3f3f4;
	border-radius: ${({ theme }) => theme.spacing(2)};
	font-size: 24px;
`;
