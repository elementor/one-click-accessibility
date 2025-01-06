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
			];
			if (supportedTags.includes(tagName)) {
				return (
					<Typography
						variant={tagName === 'div' ? 'body1' : tagName}
						component={tagName}
					>
						{node.children && node.children.map((child) => transform(child))}
					</Typography>
				);
			}
		}

		// If the node is text, replace placeholders and return
		if (node.type === 'text') {
			const replacedText = replacePlaceholders(node.data);
			return replacedText;
		}

		return null;
	};

	// Parse and transform the HTML string
	return <>{parse(htmlString, { replace: transform })}</>;
};

export default HtmlToTypography;
