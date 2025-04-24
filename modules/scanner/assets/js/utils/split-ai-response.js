export const splitDescriptions = (inputString) => {
	return inputString
		.split('\n') // Split by newlines
		.map((item) => item.trim()) // Trim leading/trailing spaces
		.filter((item) => item.length > 0) // Filter out empty lines
		.map((item) => {
			// Check if the first dot is not the last item
			if (item.indexOf('.') !== item.length - 1) {
				return item.replace(/^[^\.]*\.\s*/, ''); // Remove everything before and including the first dot
			}
			return item; // Leave the item unchanged if dot is last
		});
};
