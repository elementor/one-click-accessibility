<?php

namespace EA11y\Modules\Connect\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Utils
 */
class Utils {
	/**
	 * get_clients_url
	 * @return string
	 */
	public static function get_clients_url(): string {
		return self::get_base_url() . '/api/v1/clients';
	}

	/**
	 * get_redirect_uri
	 *
	 * @param mixed|string|null $domain
	 *
	 * @return string
	 */
	public static function get_redirect_uri( $domain = null ) : string {
		if ( false !== strpos( Config::ADMIN_PAGE, '?page=' ) ) {
			$admin_url = admin_url( Config::ADMIN_PAGE );
		} else {
			$admin_url = admin_url( 'options-general.php?page=' . Config::ADMIN_PAGE );
		}

		if ( $domain ) {
			$parsed_url = wp_parse_url( $admin_url );
			$path = $parsed_url['path'] . ( isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '' );

			return rtrim( $domain, '/' ) . $path;
		}

		return $admin_url;
	}

	public static function get_auth_url(): string {
		return self::get_base_url() . '/v1/oauth2/auth';
	}

	/**
	 * Get full authorization URL with all required parameters
	 *
	 * @param string $client_id
	 *
	 * @return string
	 */
	public static function get_authorize_url( string $client_id ) : string {
		return add_query_arg( [
			'client_id' => $client_id,
			'redirect_uri' => rawurlencode( self::get_redirect_uri() ),
			'response_type' => 'code',
			'scope' => Config::SCOPES,
			'state' => wp_create_nonce( Config::STATE_NONCE ),
		], self::get_auth_url() );
	}

	/**
	 * get_deactivation_url
	 * @param string $client_id
	 *
	 * @return string
	 */
	public static function get_deactivation_url( string $client_id ) : string {
		return self::get_base_url() . "/api/v1/clients/{$client_id}/activation";
	}

	public static function get_jwks_url(): string {
		return self::get_base_url() . '/v1/.well-known/jwks.json';
	}

	/**
	 * get_sessions_url
	 * @return string
	 */
	public static function get_sessions_url(): string {
		return self::get_base_url() . '/api/v1/session';
	}

	public static function get_token_url(): string {
		return self::get_base_url() . '/api/v1/oauth2/token';
	}

	/**
	 * Get clients URL
	 *
	 * @param string $client_id
	 *
	 * @return string
	 */
	public static function get_clients_patch_url( string $client_id ) : string {
		return self::get_base_url() . "/api/v1/clients/{$client_id}";
	}

	/**
	 * get_base_url
	 * @return string
	 */
	public static function get_base_url(): string {
		return apply_filters( 'ea11y_connect_get_base_url', Config::BASE_URL );
	}

	/**
	 * is_valid_home_url
	 * @return bool
	 */
	public static function is_valid_home_url(): bool {
		static $valid = null;
		$saved =  Data::get_home_url();

		if ( null === $valid ) {
			if ( empty( $saved ) ) {
				$valid = true;
			} else {
				$valid = $saved === apply_filters( 'ally_connect_home_url', home_url() );
			}
		}

		return $valid;
	}
}
