import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { CustomSwitch, ProItemInfotip } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const LogoSettings = () => {
	const { planData } = useSettings();

	/**
	 * Check if the feature is enabled in user's plan.
	 * @return {boolean} true if the feature is enabled.
	 */
	const isProEnabled = () => {
		return planData?.hide_logo;
	};

	return (
		<Card variant="outlined">
			<CardHeader
				title={
					<>
						{__('Elementor logo', 'pojo-accessibility')}{' '}
						{!isProEnabled() && <ProItemInfotip />}
					</>
				}
				subheader={
					<Typography variant="body2">
						{__(
							'Hide the Elementor logo from the bottom of your widget menu.',
							'pojo-accessibility',
						)}
					</Typography>
				}
				action={<CustomSwitch disabled={!isProEnabled()} />}
			/>
		</Card>
	);
};

export default LogoSettings;
