import HeadingStructureHeadingTree from '@ea11y-apps/scanner/components/heading-structure/heading-tree';
import HeadingStructureHeadingTreeEmpty from '@ea11y-apps/scanner/components/heading-structure/heading-tree-empty';
import HeadingStructureHelpText from '@ea11y-apps/scanner/components/heading-structure/help-text';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';

export const HeadingStructureLayout = () => {
	const { isLoading, pageHeadings } = useHeadingStructureContext();

	if (!pageHeadings.length && !isLoading) {
		return <HeadingStructureHeadingTreeEmpty />;
	}

	return (
		<StyledContent>
			<HeadingStructureHelpText />
			<HeadingStructureHeadingTree />
		</StyledContent>
	);
};
