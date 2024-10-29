const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// add your entry points here
const entryPoints = {
	// admin: path.resolve(
	// 	process.cwd(),
	// 	'assets/dev/js',
	// 	'admin.js',
	// ),
};

module.exports = {
	...defaultConfig,
	entry: entryPoints,
	output: {
		...defaultConfig.output,
		path: path.resolve( process.cwd(), 'assets/build' ),
	},
};
