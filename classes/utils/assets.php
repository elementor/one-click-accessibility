<?php

namespace EA11y\Classes\Utils;

use const EA11Y_ASSETS_PATH;
use const EA11Y_ASSETS_URL;
use const EA11Y_VERSION;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Assets
 */
class Assets {
	/**
	 * enqueue_scripts
	 *
	 * @param string $handle
	 * @param string $script_name
	 * @param array $dependencies
	 * @param string $version
	 * @param bool $footer
	 */
	public static function enqueue_scripts( string $handle, string $script_name, array $dependencies = [], string $version = '', bool $footer = false ) : void {
		$asset_data = self::get_asset_version_and_suffix( $version );
		wp_enqueue_script(
			$handle,
			self::get_assets_path( $script_name, 'js', $asset_data['suffix'] ),
			$dependencies,
			$asset_data['version'],
			$footer
		);
	}

	/**
	 * enqueue_styles
	 *
	 * @param string $handle
	 * @param string $style_name
	 * @param array $dependencies
	 * @param string $version
	 */
	public static function enqueue_styles( string $handle, string $style_name, array $dependencies = [], string $version = '' ) {
		$asset_data = self::get_asset_version_and_suffix( $version );
		wp_enqueue_style(
			$handle,
			self::get_assets_path( $style_name, 'css', $asset_data['suffix'] ),
			$dependencies,
			$asset_data['version']
		);
	}

	/**
	 * get_assets_version
	 *
	 * @param string $version
	 *
	 * @return string
	 */
	private static function get_assets_version( string $version = '' ) : string {
		return empty( $version ) ? \EA11Y_VERSION : $version;
	}

	/**
	 * get_assets_suffix
	 * @return string
	 */
	private static function get_assets_suffix() : string {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
	}

	/**
	 * get_asset_version_and_suffix
	 *
	 * @param string $version
	 *
	 * @return array
	 */
	private static function get_asset_version_and_suffix( string $version = '' ) : array {
		return [
			'version' => self::get_assets_version( $version ),
			'suffix' => self::get_assets_suffix(),
		];
	}

	/**
	 * get_assets_path
	 *
	 * @param string $asset_name
	 * @param string $asset_type
	 * @param string $suffix
	 *
	 * @return string
	 */
	private static function get_assets_path( string $asset_name, string $asset_type, string $suffix = '' ) : string {
		return \EA11Y_ASSETS_URL . '/build/' . $asset_name . $suffix . '.' . $asset_type;
	}

	/**
	 * enqueue_app_assets
	 *
	 * @param string $handle
	 * @param bool $with_css
	 */
	public static function enqueue_app_assets( string $handle = '', bool $with_css = true, array $dependencies = [] ) : void {
		$dir = \EA11Y_ASSETS_PATH . 'build/';
		$url = \EA11Y_ASSETS_URL . 'build/';
		$script_asset_path = $dir . $handle . '.asset.php';
		if ( ! file_exists( $script_asset_path ) ) {
			throw new \Error(
				'You need to run `npm start` or `npm run build` for the "' . esc_html( $handle ) . '" script first.'
			);
		}

		// enqueue js
		$script_asset = require $script_asset_path;
		wp_enqueue_script(
			$handle,
			$url . $handle . '.js',
			array_merge( $script_asset['dependencies'], $dependencies ),
			$script_asset['version'],
			true,
		);

		// add translation support
		wp_set_script_translations( $handle, 'pojo-accessibility' );

		if ( ! $with_css ) {
			return;
		}
		// enqueue css
		$css_file_name = 'style-' . $handle . '.css';
		$css_version = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? filemtime( $dir . $css_file_name ) : \EA11Y_VERSION;
		wp_enqueue_style(
			$handle,
			$url . $css_file_name,
			[ 'wp-components' ],
			$css_version
		);
	}
}
