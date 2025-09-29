<?php

namespace EA11y\Modules\Connect\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Data
 */
class Data {
	const CLIENT_ID = '_client_id';
	const CLIENT_SECRET = '_client_secret';
	const ACCESS_TOKEN = '_access_token';
	const REFRESH_TOKEN = '_refresh_token';
	const TOKEN_ID = '_token_id';
	const SUBSCRIPTION_ID = '_subscription_id';
	const OPTION_OWNER_USER_ID = '_owner_user_id';
	const HOME_URL = '_home_url';

	/**
	 * get_option
	 * @param $option_name
	 * @param $default
	 *
	 * @return false|mixed|null
	 */
	public static function get_option( $option_name, $default ) {
		return get_option( Config::APP_PREFIX . $option_name, $default );
	}

	/**
	 * set_option
	 * @param $option_name
	 * @param $option_value
	 * @param bool $auto_load
	 *
	 * @return bool
	 */
	public static function set_option( $option_name, $option_value, $auto_load = false ) : bool {
		return update_option( Config::APP_PREFIX . $option_name, $option_value, $auto_load );
	}

	/**
	 * delete_option
	 * @param $option_name
	 *
	 * @return bool
	 */
	public static function delete_option( $option_name ) : bool {
		return delete_option( Config::APP_PREFIX . $option_name );
	}

	/**
	 * get_user_data
	 * @param $user_id
	 * @param $data_name
	 * @param mixed|bool $default
	 *
	 * @return false|mixed
	 */
	public static function get_user_data( $user_id, $data_name, $default = false ) {
		$data = get_user_meta( $user_id, Config::APP_PREFIX . $data_name, true );

		return empty( $data ) ? $default : $data;
	}

	/**
	 * set_user_data
	 * @param $user_id
	 * @param $data_name
	 * @param $value
	 *
	 * @return bool|int
	 */
	public static function set_user_data( $user_id, $data_name, $value ) {
		return update_user_meta( $user_id, Config::APP_PREFIX . $data_name, $value );
	}

	/**
	 * delete_user_data
	 * @param $user_id
	 * @param $data_name
	 *
	 * @return bool
	 */
	public static function delete_user_data( $user_id, $data_name ) : bool {
		return delete_user_meta( $user_id, Config::APP_PREFIX . $data_name );
	}

	/**
	 * get_connect_mode_data
	 * @param ...$data
	 *
	 * @return false|mixed|null|string
	 */
	public static function get_connect_mode_data( ...$data ) {
		if ( Config::CONNECT_MODE === 'site' ) {
			return self::get_option( ...$data );
		}
		$user_id = get_current_user_id();
		return self::get_user_data( ...( [ $user_id, ...$data ] ) );
	}

	/**
	 * set_connect_mode_data
	 * @param ...$data
	 *
	 * @return bool|int
	 */
	public static function set_connect_mode_data( ...$data ) {
		if ( Config::CONNECT_MODE === 'site' ) {
			return self::set_option( ...$data );
		}
		$user_id = get_current_user_id();
		return self::set_user_data( ...( [ $user_id, ...$data ] ) );
	}

	/**
	 * get_client_id
	 *
	 * @return string|bool|mixed
	 */
	public static function get_client_id() {
		return self::get_connect_mode_data( self::CLIENT_ID, false );
	}

	/**
	 * get_client_secret
	 * @return false|mixed|string|null
	 */
	public static function get_client_secret() {
		return self::get_connect_mode_data( self::CLIENT_SECRET, false );
	}

	/**
	 * set_client_id
	 * @param $value
	 *
	 * @return bool
	 */
	public static function set_client_id( $value ) : bool {
		return self::set_connect_mode_data( self::CLIENT_ID, $value );
	}

	public static function get_subscription_id() {
		return self::get_connect_mode_data( self::SUBSCRIPTION_ID, false );
	}

	public static function set_subscription_id( $value ) : bool {
		return self::set_connect_mode_data( self::SUBSCRIPTION_ID, $value );
	}

	/**
	 * set_client_secret
	 * @param $value
	 *
	 * @return bool
	 */
	public static function set_client_secret( $value ) : bool {
		return self::set_connect_mode_data( self::CLIENT_SECRET, $value );
	}

	/**
	 * get_access_token
	 * @return false|mixed|string|null
	 */
	public static function get_access_token() {
		return self::get_connect_mode_data( self::ACCESS_TOKEN, false );
	}

	public static function get_token_id() {
		return self::get_connect_mode_data( self::TOKEN_ID, false );
	}

	/**
	 * get_refresh_token
	 * @return false|mixed|string|null
	 */
	public static function get_refresh_token() {
		return self::get_connect_mode_data( self::REFRESH_TOKEN, false );
	}

	/**
	 * get_home_url
	 *
	 * Return a plain text version of a based64 encoded home URL if it's stored as base64 encoded
	 * @return string|null
	 */
	public static function get_home_url() {
		$raw = self::get_connect_mode_data( self::HOME_URL, false );
		$is_base64 = base64_encode( base64_decode( $raw, true ) ) === $raw;
		$url = $is_base64 ? base64_decode( $raw ) : $raw;
		return apply_filters( 'ally_connect_home_url', $url );
	}

	/**
	 * set_home_url
	 *
	 * Stores home URL as a base64 string to avoid migration/stg tools from overriding value
	 */
	public static function set_home_url( ?string $home_url = null ) : bool {
		$home_url = $home_url ?? home_url();
		return self::set_connect_mode_data( self::HOME_URL, base64_encode( $home_url ) );
	}

	/**
	 * set_user_is_owner_option
	 */
	public static function set_user_is_owner_option( $value ) {
		return self::set_connect_mode_data( self::OPTION_OWNER_USER_ID, $value );
	}

	/**
	 * get_user_is_owner_option
	 */
	public static function get_user_is_owner_option() {
		return self::get_connect_mode_data( self::OPTION_OWNER_USER_ID, false );
	}

	/**
	 * fetch_option
	 * direct query to avoid cache and race condition issues
	 *
	 * @param $option_name
	 * @param $default
	 *
	 * @return mixed|null
	 */
	public static function fetch_option( $option_name, $default = null ) {
		global $wpdb;
		if ( ! self::is_option_whitelisted_for_direct_access( $option_name ) ) {
			return $default;
		}

		$cache_buster = wp_generate_uuid4();
		$option = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_value
								FROM $wpdb->options
								WHERE option_name = %s
								AND %s = %s
								LIMIT 1",
				$option_name,
				$cache_buster,
				$cache_buster
			)
		);
		if ( ! empty( $option ) ) {
			return $option[0];
		}
		return $default;
	}

	/**
	 * insert_option_uniquely
	 *
	 * used to insert option if not there already
	 * direct query to avoid cache and race condition issues
	 *
	 * @param $option_name
	 * @param $option_value
	 *
	 * @return bool
	 */
	public static function insert_option_uniquely( $option_name, $option_value ) : bool {
		global $wpdb;
		if ( ! self::is_option_whitelisted_for_direct_access( $option_name ) ) {
			return false;
		}
		$cache_buster = wp_generate_uuid4();
		$result = $wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $wpdb->options (option_name, option_value, autoload)
								SELECT * FROM (SELECT %s, %s, 'no') AS tmp
								WHERE NOT EXISTS (
									SELECT option_name
									FROM $wpdb->options
									WHERE option_name = %s
								  	AND option_value = %s
									AND %s = %s
								) LIMIT 1",
				$option_name,
				$option_value,
				$option_name,
				$option_value,
				$cache_buster,
				$cache_buster
			)
		);

		if ( false === $result || 0 === $result ) {
			// false means query failed, 0 means no row inserted because it exists
			return false;
		}

		return true;
	}

	/**
	 * is_option_whitelisted_for_direct_access
	 * allowed only list of option names
	 *
	 * @param string $option_name
	 *
	 * @return boolean
	 */
	public static function is_option_whitelisted_for_direct_access( string $option_name ) : bool {
		$options_whitelist = [
			Config::APP_NAME . Service::REFRESH_TOKEN_LOCK,
		];
		return in_array( $option_name, $options_whitelist, true );
	}

	/**
	 * User is subscription owner.
	 *
	 * Check if current user is subscription owner.
	 *
	 * @return boolean
	 */
	public static function user_is_subscription_owner(): bool {
		$owner_id = (int) self::get_connect_mode_data( self::OPTION_OWNER_USER_ID, false );

		return get_current_user_id() === $owner_id;
	}

	/**
	 * clear_session
	 */
	public static function clear_session( $with_client = false ) {
		if ( Config::CONNECT_MODE === 'site' ) {
			if ( $with_client ) {
				self::delete_option( self::CLIENT_ID );
				self::delete_option( self::CLIENT_SECRET );
			}
			self::delete_option( self::ACCESS_TOKEN );
			self::delete_option( self::REFRESH_TOKEN );
			self::delete_option( self::TOKEN_ID );
			self::delete_option( self::SUBSCRIPTION_ID );
			self::delete_option( self::OPTION_OWNER_USER_ID );
			self::delete_option( self::HOME_URL );
		} else {
			$user_id = get_current_user_id();
			if ( $with_client ) {
				self::delete_user_data( $user_id, self::CLIENT_ID );
				self::delete_user_data( $user_id, self::CLIENT_SECRET );
			}
			self::delete_user_data( $user_id, self::ACCESS_TOKEN );
			self::delete_user_data( $user_id, self::REFRESH_TOKEN );
			self::delete_user_data( $user_id, self::TOKEN_ID );
			self::delete_user_data( $user_id, self::SUBSCRIPTION_ID );
			self::delete_user_data( $user_id, self::OPTION_OWNER_USER_ID );
			self::delete_user_data( $user_id, self::HOME_URL );
		}
	}
}
