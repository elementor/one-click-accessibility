import Box from '@elementor/ui/Box';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';

export const Loader = () => (
	<Box display="flex" gap={1} flexDirection="column" sx={{ p: 2 }}>
		<StyledSkeleton width={120} height={12} sx={{ mb: 1 }} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
		<StyledSkeleton width="100%" height={48} />
	</Box>
);
