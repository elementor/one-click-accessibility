import Button from '@elementor/ui/Button';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../hooks/use-settings';
import {
	MoodEmpty,
	MoodHappy,
	MoodSad,
	MoodSadSquint,
	MoodSmile,
} from '../icons';

const RatingForm = ({ close, handleSubmitForm }) => {
	const {
		rating,
		setRating,
		setCurrentPage,
		nextButtonDisabled,
		setNextButtonDisabled,
	} = useSettings();

	const ratingsMap = [
		{
			value: 5,
			label: __('Excellent', 'pojo-accessibility'),
			icon: <MoodHappy />,
		},
		{
			value: 4,
			label: __('Pretty good', 'pojo-accessibility'),
			icon: <MoodSmile />,
		},
		{
			value: 3,
			label: __("It's okay", 'pojo-accessibility'),
			icon: <MoodEmpty />,
		},
		{
			value: 2,
			label: __('Could be better', 'pojo-accessibility'),
			icon: <MoodSadSquint />,
		},
		{
			value: 1,
			label: __('Needs improvement', 'pojo-accessibility'),
			icon: <MoodSad />,
		},
	];

	const handleRatingChange = (event, value) => {
		setRating(value);
		setNextButtonDisabled(false);
	};

	const handleNextButton = async () => {
		if (rating < 4) {
			setCurrentPage('feedback');
		} else {
			const submitted = await handleSubmitForm(close, true);

			if (submitted) {
				setCurrentPage('review');
			}
		}
	};

	return (
		<FormControl fullWidth>
			<RadioGroup
				aria-labelledby="demo-radio-buttons-group-label"
				onChange={(event, value) => handleRatingChange(event, value)}
				name="radio-buttons-group"
			>
				{ratingsMap.map(({ value, label, icon }) => {
					return (
						<ListItem key={'item-' + value} disableGutters disablePadding>
							<ListItemIcon>{icon}</ListItemIcon>
							<StyledFormControlLabel
								control={<Radio color="secondary" />}
								label={label}
								value={value}
								labelPlacement="start"
							/>
						</ListItem>
					);
				})}
			</RadioGroup>
			<StyledButton
				color="secondary"
				variant="contained"
				onClick={handleNextButton}
				disabled={nextButtonDisabled}
			>
				{__('Next', 'pojo-accessibility')}
			</StyledButton>
		</FormControl>
	);
};

export default RatingForm;

const StyledFormControlLabel = styled(FormControlLabel)`
	justify-content: space-between;
	margin-left: 0;
	width: 100%;
`;

const StyledButton = styled(Button)`
	min-width: 80px;
	align-self: flex-end;
`;
