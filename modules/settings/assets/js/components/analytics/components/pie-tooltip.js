import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';

export const PieTooltip = (props) => {
	const { itemData, series } = props;
	return (
		<Paper sx={{ p: 2, pb: 1 }}>
			<StyledTitle
				variant="body2"
				color="text.tertiary"
				itemColor={series.data[itemData.dataIndex].color}
			>
				{series.data[itemData.dataIndex].featureTitle}
			</StyledTitle>
			<Typography variant="h6">
				{`${series.data[itemData.dataIndex].featureClicks} (${series.data[itemData.dataIndex].value}%)`}
			</Typography>
		</Paper>
	);
};

const StyledTitle = styled(Typography)`
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
