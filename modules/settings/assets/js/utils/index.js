export const validateUrl = (url) => {
	const pattern =
		/^(https?):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/i;
	return pattern.test(url);
};

export const validateId = (id) => {
	const pattern = /^#[A-Za-z0-9_.-]+$/;
	return pattern.test(id);
};

// Split array to chunk for display data per page
export const chunkArray = (array, chunkSize = 10) => {
	const result = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize));
	}
	return result;
};

/**
 * Open URL links
 * @param {string} url    URL to open
 * @param {string} target Target to open the URL
 */
export const openLink = (url, target = '_blank') => {
	window.open(url, target);
};

/**
 * Calculate the plan usage percentage of the plan.
 * @param {number} allowed
 * @param {number} used
 * @return {number} The plan usage percentage.
 */
export const calculatePlanUsage = (allowed, used) => {
	if (!used || !allowed) {
		return 0;
	}

	return parseFloat(((used / allowed) * 100).toFixed(1));
};

/**
 * Format the plan value in K and M format
 * @param {string} value The value to format
 */
export const formatPlanValue = (value) => {
	if (value >= 1000000) {
		const millions = value / 1000000;
		return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
	}

	if (value >= 1000) {
		const thousands = value / 1000;
		return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
	}

	return value;
};
