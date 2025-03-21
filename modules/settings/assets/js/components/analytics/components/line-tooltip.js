import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { dateI18n } from '@wordpress/date';

export const LineTooltip = (props) => {
	const { dataIndex, axis, series } = props;
	return series[0].data[dataIndex] ? (
		<Paper sx={{ p: 2, pb: 1 }}>
			<Typography variant="body2" color="text.tertiary">
				{dateI18n('d F', axis.data[dataIndex], false)}
			</Typography>
			<Typography variant="h6">{series[0].data[dataIndex]}</Typography>
		</Paper>
	) : null;
};
