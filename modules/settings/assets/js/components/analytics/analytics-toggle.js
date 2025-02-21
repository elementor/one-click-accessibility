import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const AnalyticsToggle = () => {
	const { showAnalytics, updateShowAnalytics } = useAnalyticsContext();

	return (
		<FormControlLabel
			control={
				<Switch
					color="info"
					checked={showAnalytics}
					onChange={updateShowAnalytics}
					sx={{ ml: 2 }}
				/>
			}
			label={__('Track widget data', 'pojo-accessibility')}
			labelPlacement="start"
			sx={{ ml: 0 }}
		/>
	);
};
