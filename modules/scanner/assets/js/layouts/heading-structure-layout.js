import HeadingStructureHeadingTree from '@ea11y-apps/scanner/components/heading-structure/heading-tree';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { StyledDescription } from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { injectTemplateVars } from '@ea11y-apps/scanner/utils/inject-template-vars';
import { __ } from '@wordpress/i18n';

export const HeadingStructureLayout = () => {
	return (
		<>
			<StyledContent>
				<StyledDescription as="p" variant="body2">
					{__(
						'Make sure your headings are tagged at the right level and that there is an H1 that tells what the page is about.',
						'pojo-accessibility',
					)}
				</StyledDescription>

				<StyledDescription as="p" variant="body2">
					{injectTemplateVars(
						__(
							'{{bold}}Note:{{/bold}} Changing heading levels won’t affect how it looks on the page.',
							'pojo-accessibility',
						),
						{
							bold: ({ children }) => <span>{children}</span>,
						},
					)}
				</StyledDescription>

				<HeadingStructureHeadingTree />
			</StyledContent>
		</>
	);
};
