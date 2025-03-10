import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Skeleton from '@elementor/ui/Skeleton';
import Stack from '@elementor/ui/Stack';
import Typography from '@elementor/ui/Typography';
import { UsageTableTitle } from '@ea11y/components/analytics/components/usage-table-title';
import { StyledCardContent } from '@ea11y/pages/pages.styles';

export const UsageTableSkeleton = ({ animated }) => (
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
					<UsageTableTitle />
				)
			}
			sx={{ height: '60px', alignItems: 'start' }}
		/>
		<StyledCardContent sx={{ pt: 3 }}>
			<Stack spacing={1}>
				{Array.from({ length: 10 }).map((_, index) => (
					<Stack key={index} direction="row" alignItems="center" spacing={8}>
						<Skeleton
							width={230}
							height={25}
							animation={animated ? 'wave' : false}
							sx={{ mr: 6 }}
						/>
						<Skeleton
							width={120}
							height={25}
							animation={animated ? 'wave' : false}
						/>
					</Stack>
				))}
			</Stack>
		</StyledCardContent>
	</Card>
);
