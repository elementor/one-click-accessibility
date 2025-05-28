export const splitDescriptions = (inputString) => {
	return inputString
		.replace('Here are 5 alt text descriptions for the image:', '')
		.replace('Here are 5 concise alt text descriptions for the image:', '')
		.split('\n') // Split by newlines
		.map((item) => item.trim()) // Trim leading/trailing spaces
		.filter((item) => item.length > 0) // Filter out empty lines
		.map((item) => {
			// Check if the first dot is not the last item
			if (item.indexOf('.') !== item.length - 1) {
				item = item.replace(/^[^\.]*\.\s*/, ''); // Remove everything before and including the first dot
			}

			if (item.length >= 2 && item.startsWith('"') && item.endsWith('"')) {
				item = item.slice(1, -1);
			}

			return item; // Leave the item unchanged if dot is last
		});
};
