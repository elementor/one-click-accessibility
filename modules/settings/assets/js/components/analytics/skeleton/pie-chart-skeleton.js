import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Skeleton from '@elementor/ui/Skeleton';
import Stack from '@elementor/ui/Stack';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { PieChartTitle } from '@ea11y/components/analytics/components/pie-chart-title';
import { StyledCardContent } from '@ea11y/pages/pages.styles';
import { useEffect, useRef, useState } from '@wordpress/element';

export const PieChartSkeleton = ({ animated }) => {
	const containerRef = useRef(null);
	const [chartWidth, setChartWidth] = useState(null);

	const setWidth = () => {
		const width = Number(containerRef.current.offsetWidth) / 3;
		setChartWidth(width > 180 ? 180 : width);
	};

	useEffect(() => {
		setWidth();
	}, [containerRef]);

	return (
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
						<PieChartTitle />
					)
				}
				sx={{ height: '60px', alignItems: 'start' }}
			/>
			<StyledCardContent ref={containerRef} sx={{ pt: 5 }}>
				<Stack
					direction="row"
					spacing={6}
					alignItems="center"
					justifyContent="center"
					sx={{ pb: 4 }}
				>
					<StyledCircle
						variant="circular"
						width={chartWidth}
						height={chartWidth}
						animation={animated ? 'wave' : false}
					/>

					{/* Legend Skeleton */}
					<Stack spacing={2}>
						{Array.from({ length: 5 }).map((_, index) => (
							<Stack
								key={index}
								direction="row"
								alignItems="center"
								spacing={1}
							>
								<Skeleton
									variant="circular"
									width={10}
									height={10}
									animation={animated ? 'wave' : false}
								/>
								<Skeleton
									variant="rounded"
									width={chartWidth}
									height={15}
									animation={animated ? 'wave' : false}
								/>
							</Stack>
						))}
					</Stack>
				</Stack>
			</StyledCardContent>
		</Card>
	);
};

const StyledCircle = styled(Skeleton)`
	position: relative;

	&:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: calc(100% - 30px);
		height: calc(100% - 30px);
		border-radius: 50%;
		background: ${({ theme }) => theme.palette.background.default};
		z-index: 1;
	}
`;
