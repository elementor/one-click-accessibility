import {
	SkeletonContainer,
	StyledSkeleton,
} from '@ea11y-apps/scanner/styles/app.styles';

export const Loader = () => (
	<SkeletonContainer>
		<StyledSkeleton width={120} height={12} sx={{ mb: 1 }} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
	</SkeletonContainer>
);
