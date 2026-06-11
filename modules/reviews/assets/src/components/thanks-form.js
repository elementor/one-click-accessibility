import FormControl from '@elementor/ui/FormControl';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';
import { MoodHappy } from '../icons';

const ThanksForm = () => {
	return (
		<StyledFormControl fullWidth>
			<StyledMoodHappy />
			<Typography variant="h6" marginBlockEnd={1}>
				{__('Thanks for letting us know', 'pojo-accessibility')}
			</Typography>
			<Typography
				variant="body1"
				color="secondary"
				marginBlockEnd={3}
				width="70%"
			>
				{__('Help us make Ally even better.', 'pojo-accessibility')}
				<br />
				{__('Open to a quick call?', 'pojo-accessibility')}
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
