import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Skeleton from '@elementor/ui/Skeleton';
import Stack from '@elementor/ui/Stack';
import { StyledCardContent } from '@ea11y/pages/pages.styles';

export const UsageTableSkeleton = () => (
	<Card variant="outlined" sx={{ height: '100%' }}>
		<CardHeader
			title={<Skeleton width={150} sx={{ padding: '20px' }} animation="wave" />}
			sx={{ height: '60px' }}
		/>
		<StyledCardContent sx={{ pt: 3 }}>
			<Stack spacing={1}>
				{Array.from({ length: 10 }).map((_, index) => (
					<Stack key={index} direction="row" alignItems="center" spacing={8}>
						<Skeleton width={230} height={25} animation="wave" sx={{ mr: 6 }} />
						<Skeleton width={120} height={25} animation="wave" />
					</Stack>
				))}
			</Stack>
		</StyledCardContent>
	</Card>
);
