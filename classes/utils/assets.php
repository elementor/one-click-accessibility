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
	private static ?array $chunks_manifest = null;

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
		$chunk_handles = self::enqueue_vendor_chunks( $handle, $dir, $url, $script_asset['version'] );

		wp_enqueue_script(
			$handle,
			$url . $handle . '.js',
			array_merge( $script_asset['dependencies'], $dependencies, $chunk_handles ),
			$script_asset['version'],
			true,
		);

		// add translation support
		wp_set_script_translations( $handle, 'pojo-accessibility' );

		if ( ! $with_css ) {
			return;
		}
		// enqueue css
		$css_file_name = $handle . '.css';
		$css_version = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? filemtime( $dir . $css_file_name ) : \EA11Y_VERSION;
		wp_enqueue_style(
			$handle,
			$url . $css_file_name,
			[ 'wp-components' ],
			$css_version
		);
	}

	private static function enqueue_vendor_chunks( string $entry_handle, string $dir, string $url, string $version ): array {
		$manifest = self::load_chunks_manifest( $dir );

		if ( empty( $manifest[ $entry_handle ] ) ) {
			return [];
		}

		$entry_file = $entry_handle . '.js';
		$chunk_handles = [];

		foreach ( $manifest[ $entry_handle ] as $chunk_file ) {
			if ( $chunk_file === $entry_file ) {
				continue;
			}

			$slug = basename( $chunk_file, '.js' );
			$chunk_handle = 'ea11y-' . $entry_handle . '-chunk-' . $slug;

			if ( wp_script_is( $chunk_handle, 'enqueued' ) ) {
				$chunk_handles[] = $chunk_handle;
				continue;
			}

			$chunk_deps = [];
			$chunk_asset_path = $dir . $slug . '.asset.php';
			if ( file_exists( $chunk_asset_path ) ) {
				$chunk_asset = require $chunk_asset_path;
				$chunk_deps = $chunk_asset['dependencies'] ?? [];
			}

			wp_enqueue_script( $chunk_handle, $url . $chunk_file, $chunk_deps, $version, true );
			$chunk_handles[] = $chunk_handle;
		}

		return $chunk_handles;
	}

	private static function load_chunks_manifest( string $dir ): array {
		if ( null !== self::$chunks_manifest ) {
			return self::$chunks_manifest;
		}

		$manifest_path = $dir . 'chunks-manifest.json';
		if ( ! file_exists( $manifest_path ) ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( 'Ally: chunks-manifest.json not found in build directory. Run `npm run build`.' );
			self::$chunks_manifest = [];
			return self::$chunks_manifest;
		}

		$manifest = json_decode( (string) file_get_contents( $manifest_path ), true );
		self::$chunks_manifest = is_array( $manifest ) ? $manifest : [];

		return self::$chunks_manifest;
	}
}
