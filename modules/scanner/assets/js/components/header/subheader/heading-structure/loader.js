import Divider from '@elementor/ui/Divider';
import { StyledSkeleton } from '@ea11y-apps/scanner/styles/app.styles';
import { StyledTitleRowContainer } from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { memo } from '@wordpress/element';

const HeadingStructureTitleRowLoader = memo(() => {
	return (
		<StyledTitleRowContainer
			direction="row"
			divider={<Divider orientation="vertical" flexItem />}
			gap={2}
		>
			<StyledSkeleton width={70} height={18} />
			<StyledSkeleton width={70} height={18} />
			<StyledSkeleton width={110} height={18} />
		</StyledTitleRowContainer>
	);
});

export default HeadingStructureTitleRowLoader;
