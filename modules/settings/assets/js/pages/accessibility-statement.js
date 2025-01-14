import Container from '@elementor/ui/Container';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { BottomBar } from '@ea11y/components';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AccessibilityStatement = () => {
	useEffect(() => {
		mixpanelService.sendEvent('Page View', {
			page: 'Accessibility statement',
		});
	}, []);

	return (
		<>
			<Container p={1} sx={{ overflow: 'auto', maxHeight: '100%', padding: 4 }}>
				<Typography
					variant="h4"
					color="text.primary"
					fontWeight="400"
					marginBottom={2}
				>
					{__('Accessibility statement', 'pojo-accessibility')}
				</Typography>
				<Typography
					variant="body2"
					color="text.primary"
					width="60%"
					marginBottom={4}
				>
					{__(
						'An accessibility statement showcases your efforts to create an inclusive online space, highlighting helpful features and a commitment to accessibility. Learn more',
						'pojo-accessibility',
					)}
				</Typography>
				<Typography variant="subtitle1" color="text.primary" marginBottom={2}>
					{__(
						'Already have an accessibile statement page?',
						'pojo-accessibility',
					)}
				</Typography>
				<FormControl sx={{ marginBottom: 4 }}>
					<RadioGroup
						aria-labelledby="accessibility-statement-page"
						defaultValue={false}
						name="radio-buttons-group"
						row
					>
						<FormControlLabel
							control={<Radio size="small" color="default" />}
							label={__('No, I do not have one', 'pojo-accessibility')}
							value={false}
						/>
						<FormControlLabel
							control={<Radio size="small" color="default" />}
							label={__('Yes', 'pojo-accessibility')}
							value={true}
						/>
					</RadioGroup>
				</FormControl>
			</Container>
			<BottomBar />
		</>
	);
};

export default AccessibilityStatement;
