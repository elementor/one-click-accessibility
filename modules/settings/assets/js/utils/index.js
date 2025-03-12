import { createElement } from '@wordpress/element';

export const injectTemplateVars = (message, components) => {
	const regex = /\{\{(\w+)\}\}([^]*?)\{\{\/\1\}\}/g;
	const splitMessage = message.split(regex);

	// eslint-disable-next-line array-callback-return
	return splitMessage.map((part, index) => {
		if (index % 3 === 0) {
			return part;
		}

		if (index % 3 === 1) {
			return createElement(
				components[part],
				{ key: index },
				splitMessage[index + 1],
			);
		}
	});
};

export const validateUrl = (url) => {
	const pattern =
		/^(https?):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/i;
	return pattern.test(url);
};

export const validateId = (id) => {
	const pattern = /^#[A-Za-z0-9_.-]+$/;
	return pattern.test(id);
};
