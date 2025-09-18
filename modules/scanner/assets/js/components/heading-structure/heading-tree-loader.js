import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { memo } from '@wordpress/element';

const HeadingStructureHeadingTreeLoader = memo(() => {
	return (
		<StyledLoaderContainer>
			<StyledSkeleton width="100%" height={48} />
			<StyledSkeleton width="100%" height={48} />
			<StyledSkeleton width="100%" height={48} />
			<StyledSkeleton width="100%" height={48} />
			<StyledSkeleton width="100%" height={48} />
			<StyledSkeleton width="100%" height={48} />
			<StyledSkeleton width="100%" height={48} />
		</StyledLoaderContainer>
	);
});

const StyledLoaderContainer = styled(Box)`
	display: flex;
	flex-direction: column;

	margin-top: ${({ theme }) => theme.spacing(2)};
	gap: ${({ theme }) => theme.spacing(1.5)};
`;

export default HeadingStructureHeadingTreeLoader;
