<?php

namespace EA11y\Modules\Widget\Components;

use EA11y\Modules\Widget\Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Cache_Compatibility
 */
class Cache_Compatibility {

	/**
	 * remove_protocol_from_widget_url
	 * @param $url
	 *
	 * @return string
	 */
	public static function remove_protocol_from_widget_url( $url ): string {
		return str_replace( [ 'http://', 'https://' ], '', $url );
	}

	/**
	 * exclude_widget_script_array
	 * @param $scripts
	 *
	 * @return mixed
	 */
	public function exclude_widget_script_array( $scripts  ) {
		$scripts[] = self::remove_protocol_from_widget_url( Module::get_widget_url() );
		return $scripts;
	}

	/**
	 * exclude_widget_script_comma_seperated
	 * @param $scripts
	 *
	 * @return string
	 */
	public function exclude_widget_script_comma_seperated( $scripts ): string {
		$scripts .= ',' . self::remove_protocol_from_widget_url( Module::get_widget_url() );
		return $scripts;
	}

	/**
	 * w3tc_minify_js_do_tag_minification
	 * @param $do_tag_minification
	 * @param $script_tag
	 * @param $file
	 *
	 * @return false|mixed
	 */
	public function w3tc_minify_js_do_tag_minification( $do_tag_minification, $script_tag, $file ) {
		if ( false !== strpos( $file, 'a11y/widget.js' ) ) {
			return false;
		}
		return $do_tag_minification;
	}

	/**
	 * sg_cache_exclude_js
	 * @param $excluded_js
	 *
	 * @return mixed
	 */
	public function exclude_widget_script_handle_array( $excluded_js ) {
		if( ! is_array( $excluded_js ) ) {
			return $excluded_js;
		}

		$excluded_js[] = 'ea11y-widget';
		return $excluded_js;
	}

	/**
	 * wpml_home_url	
	 *
	 * @param string $url
	 * @return string
	 */
	public function wpml_home_url( $url ) {
		if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
			return get_site_url();
		}

		return $url;
	}

	public function __construct() {
		// WP Rocket
		add_filter( 'rocket_exclude_js', [ $this, 'exclude_widget_script_array' ] );
		add_filter( 'rocket_minify_excluded_external_js', [ $this, 'exclude_widget_script_array' ] );

		// LiteSpeed Cache
		add_filter( 'litespeed_optimize_js_excludes', [ $this, 'exclude_widget_script_array' ] );
		// wpml support
		add_filter( 'ally_connect_home_url', [ $this, 'wpml_home_url' ] );
	}
}
