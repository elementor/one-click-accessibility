/**
 * Truncate email address if it exceeds the maximum length.
 * @param {string} email     Email address
 * @param {number} maxLength Maximum length of the email address
 * @return {*|string} Truncated email address
 */
export const truncateEmail = (email, maxLength = 24) => {
	if (email === undefined || email === null) {
		return '';
	}

	if (email.length <= maxLength) {
		return email;
	}

	return email.slice(0, maxLength - 3) + '...';
};
