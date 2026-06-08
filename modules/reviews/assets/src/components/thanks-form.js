import FormControl from '@elementor/ui/FormControl';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { MoodHappy } from '../icons';

const ThanksForm = () => {
	return (
		<FormControl
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				textAlign: 'center',
			}}
			fullWidth
		>
			<MoodHappy
				sx={{
					p: 1.5,
					backgroundColor: '#f3f3f4',
					borderRadius: 2,
					fontSize: 24,
				}}
			/>
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
		</FormControl>
	);
};

export default ThanksForm;
