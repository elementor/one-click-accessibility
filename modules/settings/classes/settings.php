<?php

namespace EA11y\Modules\Settings\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings {

	/**
	 * Returns plugin settings data by option name typecasted to an appropriate data type.
	 *
	 * @param string $option_name
	 * @return mixed
	 */
	public static function get( string $option_name ) {
		$data = get_option( $option_name );

		switch ( $option_name ) {
			default:
				return $data;
		}
	}
}
