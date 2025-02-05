import Typography from '@elementor/ui/Typography';
import parse from 'html-react-parser';

const HtmlToTypography = ({ htmlString, replacements }) => {
	// Replace placeholders in the text string with state variables
	const replacePlaceholders = (text) => {
		let updatedText = text;

		// Replace each placeholder with the corresponding value from replacements
		Object.keys(replacements).forEach((key) => {
			const placeholder = `{${key}}`; // Create placeholder format (e.g., {company_name})
			const value = replacements[key]; // Get the replacement value

			// Show placeholders in the preview until user fills in details.
			if (replacements[key] === '') {
				const preparedText = `[${key?.split('_').join(' ')}]`;
				updatedText = updatedText.replace(
					new RegExp(placeholder, 'g'),
					preparedText,
				);
			}
			updatedText = updatedText.replace(new RegExp(placeholder, 'g'), value);
		});

		return updatedText;
	};

	// Function to transform HTML elements into Typography components
	const transform = (node) => {
		if (node.type === 'tag') {
			const tagName = node.name; // Extract the HTML tag name

			// Map HTML tags to Typography variants
			const supportedTags = [
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'p',
				'span',
				'div',
				'strong',
			];
			if (supportedTags.includes(tagName)) {
				return (
					<Typography
						variant={tagName === 'p' ? 'body2' : 'subtitle2'}
						component={tagName}
						marginBottom={1}
						sx={node.attribs.class ? { textAlign: 'center' } : {}} //for correct render on preview
						color={tagName === 'p' ? 'text.secondary' : 'text.primary'}
					>
						{node.children && node.children.map((child) => transform(child))}
					</Typography>
				);
			}
		}

		// If the node is text, replace placeholders and return
		if (node.type === 'text') {
			return replacePlaceholders(node.data);
		}

		return null;
	};

	// Parse and transform the HTML string
	return <>{parse(htmlString, { replace: transform })}</>;
};

export default HtmlToTypography;
