const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// add your entry points here
const entryPoints = {
	admin: path.resolve(process.cwd(), 'modules/settings/assets/js', 'admin.js'),
};

const env = dotenv.config().parsed;

module.exports = {
	...defaultConfig,
	entry: entryPoints,
	output: {
		...defaultConfig.output,
		path: path.resolve(process.cwd(), 'assets/build'),
	},
	plugins: [
		...defaultConfig.plugins,
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(env),
		}),
	],
	resolve: {
		alias: {
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
		},
		extensions: ['.js', '.jsx'],
	},
};
