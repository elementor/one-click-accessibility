export const checkCompanyName = (companyName) => {
	return typeof companyName === 'string' && companyName.trim().length > 0;
};

export const checkEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const checkDomain = (domain) => {
	// Support IDNs
	const domainRegex =
		/^(https?:\/\/)?([a-zA-Z0-9\u00A1-\uFFFF-]+\.)+[a-zA-Z\u00A1-\uFFFF]{2,}\/?$/;
	return domainRegex.test(domain);
};

export const parseContent = (text, replacements) => {
	let updatedText = text;

	// Replace each placeholder with the corresponding value from replacements
	Object.keys(replacements).forEach((key) => {
		const placeholder = `{${key}}`; // Create placeholder format (e.g., {company_name})
		const value = replacements[key]; // Get the replacement value
		updatedText = updatedText.replace(new RegExp(placeholder, 'g'), value);
	});

	return updatedText;
};
