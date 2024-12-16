<?php

namespace EA11y\Modules\Settings\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings {
	public const CLOSE_POST_CONNECT_MODAL = 'ea11y_close_post_connect_modal';

	/**
	 * Returns plugin settings data by option name typecasted to an appropriate data type.
	 *
	 * @param string $option_name
	 * @return mixed
	 */
	public static function get( string $option_name ) :mixed {
		$data = get_option( $option_name );

		switch ( $option_name ) {
			default:
				return $data;
		}
	}
	public static function set( string $option_name, $value ): bool {
		return update_option( $option_name, $value, false );
	}
}
