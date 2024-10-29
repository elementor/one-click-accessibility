class APIError extends Error {
	constructor( message ) {
		super( message );

		this.name = 'APIError';
	}
}

export default APIError;
