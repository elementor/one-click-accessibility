<?php

namespace EA11y\Modules\Settings\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings {

	public const IS_VALID_PLAN_DATA = 'ea11y_is_valid_plan_data';
	public const PLAN_DATA = 'ea11y_plan_data';
	public const WIDGET_ICON_SETTINGS = 'ea11y_widget_icon_settings';
	public const WIDGET_MENU_SETTINGS = 'ea11y_widget_menu_settings';

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
	public static function set( string $option_name, $value ): bool {
		return update_option( $option_name, $value, false );
	}
}
