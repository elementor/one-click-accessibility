import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';

const StatsPieTooltip = (props) => {
	const { itemData, series } = props;
	const data = series.data[itemData.dataIndex];
	return (
		<Paper sx={{ p: 2, pb: 1 }}>
			<StyledStatsPieTooltipTitle
				variant="body2"
				color="text.tertiary"
				itemColor={data.color}
			>
				{data.label}
			</StyledStatsPieTooltipTitle>
			<Typography variant="h6">{`${data.value}%`}</Typography>
		</Paper>
	);
};

export default StatsPieTooltip;

const StyledStatsPieTooltipTitle = styled(Typography)`
	position: relative;
	padding-left: 18px;
	&:before {
		content: '';
		position: absolute;
		left: 0;
		top: calc(50% - 5px);
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: ${(props) => props.itemColor};
	}
`;
