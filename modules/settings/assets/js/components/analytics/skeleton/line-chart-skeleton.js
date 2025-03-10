import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Skeleton from '@elementor/ui/Skeleton';
import Typography from '@elementor/ui/Typography';
import { LineChartTitle } from '@ea11y/components/analytics/components/line-chart-title';
import ChartSkeleton from '@ea11y/icons/chart-skeleton';
import { StyledCardContent } from '@ea11y/pages/pages.styles';

export const LineChartSkeleton = ({ animated }) => (
	<Card variant="outlined" sx={{ height: '100%' }}>
		<CardHeader
			title={
				animated ? (
					<Typography variant="subtitle1">
						<Skeleton
							width={150}
							sx={{ p: 2 }}
							animation={animated ? 'wave' : false}
							variant="text"
						/>
					</Typography>
				) : (
					<LineChartTitle />
				)
			}
			subheader={
				!animated ? (
					<Typography variant="h3" sx={{ height: '50px' }}>
						--
					</Typography>
				) : null
			}
			sx={{ height: animated ? '100px' : 'auto', alignItems: 'start' }}
		/>
		<StyledCardContent sx={{ pt: 3, pr: 4 }}>
			<ChartSkeleton width="489" height="194" />
		</StyledCardContent>
	</Card>
);
