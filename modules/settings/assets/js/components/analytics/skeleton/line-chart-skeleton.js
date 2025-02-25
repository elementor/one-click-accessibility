import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Skeleton from '@elementor/ui/Skeleton';
import ChartSkeleton from '@ea11y/icons/chart-skeleton';
import { StyledCardContent } from '@ea11y/pages/pages.styles';

export const LineChartSkeleton = ({ animated }) => (
	<Card variant="outlined" sx={{ height: '100%' }}>
		<CardHeader
			title={
				<Skeleton
					width={150}
					sx={{ padding: '20px' }}
					animation={animated ? 'wave' : false}
				/>
			}
			sx={{ height: '60px' }}
		/>
		<StyledCardContent sx={{ pt: 8, pr: 4 }}>
			<ChartSkeleton width="489" height="194" />
		</StyledCardContent>
	</Card>
);
