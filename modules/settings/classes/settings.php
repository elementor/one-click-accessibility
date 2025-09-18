<?php

namespace EA11y\Modules\Settings\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings {
	public const CLOSE_POST_CONNECT_MODAL = 'ea11y_close_post_connect_modal';
	public const CLOSE_ONBOARDING_MODAL = 'ea11y_close_onboarding_modal';

	public const IS_VALID_PLAN_DATA = 'ea11y_is_valid_plan_data';
	public const PLAN_DATA = 'ea11y_plan_data';
	public const PLAN_SCOPE = 'ea11y_plan_scope';
	public const WIDGET_ICON_SETTINGS = 'ea11y_widget_icon_settings';
	public const WIDGET_MENU_SETTINGS = 'ea11y_widget_menu_settings';
	public const SKIP_TO_CONTENT = 'ea11y_skip_to_content_settings';
	public const ANALYTICS_SETTINGS = 'ea11y_analytics_enabled';
	public const PLAN_DATA_REFRESH_TRANSIENT = 'ea11y_plan_data_refresh';

	/**
	 * Returns plugin settings data by option name
	 * type cast to an appropriate data type.
	 *
	 * @param string $option_name
	 * @return mixed
	 */
	public static function get( string $option_name ) {
		switch ( $option_name ) {
			case self::PLAN_DATA:
				$value = get_option( $option_name );

				if ( is_string( $value ) ) {
					return json_decode( $value );
				}

				return $value;

			default:
				return get_option( $option_name );
		}
	}

	/**
	 * Update the settings data by option name.
	 *
	 * @param string $option_name
	 * @param $value
	 *
	 * @return bool
	 */
	public static function set( string $option_name, $value ) : bool {
		return update_option( $option_name, $value, false );
	}
}
