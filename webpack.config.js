const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// add your entry points here
const entryPoints = {
	admin: path.resolve(process.cwd(), 'modules/settings/assets/js', 'admin.js'),
	scanner: path.resolve(process.cwd(), 'modules/scanner/assets/js', 'index.js'),
	'ea11y-scanner-wizard': path.resolve(
		process.cwd(),
		'assets/dev/css',
		'ea11y-scanner-wizard.css',
	),
	fonts: path.resolve(process.cwd(), 'assets/css', 'fonts.css'),
	'skip-link': path.resolve(process.cwd(), 'assets/dev/css', 'skip-link.css'),
	'gutenberg-custom-link': path.resolve(
		process.cwd(),
		'modules/widget/assets/js',
		'ally-gutenberg-block.js',
	),
};

// React JSX Runtime Polyfill
const reactJSXRuntimePolyfill = {
	entry: {
		'react-jsx-runtime': {
			import: 'react/jsx-runtime',
		},
	},
	output: {
		path: path.resolve(__dirname, 'assets/lib'),
		filename: 'react-jsx-runtime.js',
		library: {
			name: 'ReactJSXRuntime',
			type: 'window',
		},
	},
	externals: {
		react: 'React',
	},
};

module.exports = [
	{
		...defaultConfig,
		entry: entryPoints,
		output: {
			...defaultConfig.output,
			path: path.resolve(process.cwd(), 'assets/build'),
			clean: true,
		},
		resolve: {
			alias: {
				'@ea11y-apps/global': path.resolve(__dirname, 'assets/dev/js'),
				'@ea11y/hooks': path.resolve(
					__dirname,
					'modules/settings/assets/js/hooks/',
				),
				'@ea11y/components': path.resolve(
					__dirname,
					'modules/settings/assets/js/components/',
				),
				'@ea11y/icons': path.resolve(
					__dirname,
					'modules/settings/assets/js/icons/',
				),
				'@ea11y/layouts': path.resolve(
					__dirname,
					'modules/settings/assets/js/layouts/',
				),
				'@ea11y/pages': path.resolve(
					__dirname,
					'modules/settings/assets/js/pages/',
				),
				'@ea11y/services': path.resolve(
					__dirname,
					'modules/settings/assets/js/services',
				),
				'@ea11y-apps/scanner': path.resolve(
					__dirname,
					'modules/scanner/assets/js',
				),
			},
			extensions: ['.js', '.jsx'],
		},
		optimization: {
			...defaultConfig.optimization,
			minimize: true,
			minimizer: [
				...defaultConfig.optimization.minimizer,
				new CssMinimizerPlugin(), // Minimize CSS
			],
		},
	},

	reactJSXRuntimePolyfill,
];
