import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { CustomSwitch, ProItemInfotip } from '@ea11y/components';
import { useSettings, useToggleSetting } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { PRO_FEATURES } from '../constants/index';

const LogoSettings = () => {
	const { widgetMenuSettings, planData } = useSettings();
	const { toggleMenu } = useToggleSetting();

	/**
	 * Check if the feature is enabled in user's plan.
	 * @return {boolean} true if the feature is enabled.
	 */
	const isProEnabled = () => {
		const key = PRO_FEATURES.REMOVE_BRANDING.replaceAll('-', '_');
		return planData?.plan?.features?.[key];
	};

	return (
		<Card variant="outlined">
			<CardHeader
				title={
					<>
						{__('Ally by Elementor logo', 'pojo-accessibility')}
						{!isProEnabled() && (
							<ProItemInfotip
								childKey={PRO_FEATURES.REMOVE_BRANDING}
								childValue="pro"
								source="icon"
								showIcon={true}
							/>
						)}
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
				action={
					<ProItemInfotip
						childKey={PRO_FEATURES.REMOVE_BRANDING}
						childValue="pro"
						source="toggle"
						enabled={isProEnabled()}
					>
						<CustomSwitch
							disabled={!isProEnabled()}
							onChange={() => toggleMenu('pro', PRO_FEATURES?.REMOVE_BRANDING)}
							checked={
								widgetMenuSettings?.[PRO_FEATURES?.REMOVE_BRANDING]?.enabled ||
								false
							}
						/>
					</ProItemInfotip>
				}
			/>
		</Card>
	);
};

export default LogoSettings;
