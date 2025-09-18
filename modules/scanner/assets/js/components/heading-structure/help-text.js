import { injectTemplateVars } from '@ea11y-apps/global/utils/inject-template-vars';
import { StyledDescription } from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const HeadingStructureHelpText = memo(() => {
	return (
		<>
			<StyledDescription as="p" variant="body2">
				{__(
					'Make sure the order of your headings makes sense, so content is read in the right order.',
					'pojo-accessibility',
				)}
			</StyledDescription>

			<StyledDescription as="p" variant="body2">
				{injectTemplateVars(
					__(
						'{{bold}}Note:{{/bold}} Changing a heading’s level won’t affect how it looks.',
						'pojo-accessibility',
					),
					{
						bold: ({ children }) => <span>{children}</span>,
					},
				)}
			</StyledDescription>
		</>
	);
});

export default HeadingStructureHelpText;
