class APIError extends Error {
	constructor(message, code = null, data = null) {
		super(message);

		this.name = 'APIError';
		this.code = code;
		this.data = data;
	}
}

export default APIError;
