<?php

namespace EA11y\Modules\Connect\Classes;

use EA11y\Classes\Logger;
use EA11y\Modules\Connect\Classes\Exceptions\Service_Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Service
 */
class Service {
	const REFRESH_TOKEN_LOCK = '_connect_refresh_token';
	const APP_TYPE = 'APP_ACCESS';

	/**
	 * Registers new client and returns client ID
	 *
	 * @return string
	 * @throws Service_Exception
	 */
	public static function register_client(): string {
		$clients_url = Utils::get_clients_url();

		if ( ! $clients_url ) {
			throw new Service_Exception( 'Missing client registration URL' );
		}

		$client_data = self::request( $clients_url, [
			'method' => 'POST',
			'headers' => [
				'Content-Type' => 'application/json',
			],
			'body' => wp_json_encode([
				'redirect_uri' => Utils::get_redirect_uri(),
				'app_type' => Config::APP_TYPE,
			]),
		], 201 );

		$client_id = $client_data['client_id'] ?? null;
		$client_secret = $client_data['client_secret'] ?? null;

		Data::set_client_id( $client_id );
		Data::set_client_secret( $client_secret );
		Data::set_home_url();

		return $client_id;
	}

	/**
	 * Deactivate license
	 *
	 * @return void
	 * @throws Service_Exception
	 */
	public static function deactivate_license(): void {
		$client_id = Data::get_client_id();

		if ( ! $client_id ) {
			throw new Service_Exception( 'Missing client ID' );
		}

		$deactivation_url = Utils::get_deactivation_url( $client_id );

		if ( ! $deactivation_url ) {
			throw new Service_Exception( 'Missing deactivation URL' );
		}

		// ensure a fresh token
		self::refresh_token();

		$access_token = Data::get_access_token();

		if ( ! $access_token ) {
			throw new Service_Exception( 'Missing access token' );
		}

		self::request($deactivation_url, [
			'method' => 'DELETE',
			'headers' => [
				'Authorization' => "Bearer {$access_token}",
			],
		], 204);

		Data::set_connect_mode_data( Data::ACCESS_TOKEN, null );
	}

	/**
	 * disconnect
	 *
	 * @return void
	 * @throws Service_Exception
	 */
	public static function disconnect(): void {
		$sessions_url = Utils::get_sessions_url();

		if ( ! $sessions_url ) {
			throw new Service_Exception( 'Missing sessions URL' );
		}

		$access_token = Data::get_access_token();

		if ( ! $access_token ) {
			throw new Service_Exception( 'Missing access token' );
		}

		self::request( $sessions_url, [
			'method' => 'DELETE',
			'headers' => [
				'Content-Type' => 'application/json',
				'Authorization' => "Bearer {$access_token}",
			],
		], 204 );

		Data::clear_session();
	}

	/**
	 * disconnect
	 *
	 * @return void
	 * @throws Service_Exception
	 */
	public static function reconnect(): void {
		$sessions_url = Utils::get_sessions_url();

		if ( ! $sessions_url ) {
			throw new Service_Exception( 'Missing sessions URL' );
		}

		Data::clear_session();
	}

	/**
	 * Get token & optionally save to user
	 *
	 * @param string $grant_type
	 *
	 * @param string|null $credential
	 * @param bool|null $update
	 *
	 * @return array
	 * @throws Service_Exception
	 */
	public static function get_token( string $grant_type, ?string $credential = null, ?bool $update = true ) : array {
		$token_url = Utils::get_token_url();

		if ( ! $token_url ) {
			throw new Service_Exception( 'Missing token URL' );
		}

		$client_id = Data::get_client_id();
		$client_secret = Data::get_client_secret();

		if ( empty( $client_id ) || empty( $client_secret ) ) {
			throw new Service_Exception( 'Missing client ID or secret' );
		}

		$body = [
			'grant_type' => $grant_type,
			'redirect_uri' => Utils::get_redirect_uri(),
		];

		switch ( $grant_type ) {
			case GrantTypes::AUTHORIZATION_CODE:
				$body['code'] = $credential;
				break;
			case GrantTypes::REFRESH_TOKEN:
				$body[ GrantTypes::REFRESH_TOKEN ] = $credential;
				break;
			case GrantTypes::CLIENT_CREDENTIALS:
				$body['redirect_uri'] = Utils::get_redirect_uri( Data::get_home_url() );

				break;
			default:
				throw new Service_Exception( 'Invalid grant type' );
		}

		$data = self::request( $token_url, [
			'method' => 'POST',
			'headers' => [
				'x-elementor-apps' => Config::APP_NAME,
				'Authorization' => 'Basic ' . base64_encode( "{$client_id}:{$client_secret}" ), // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
			],
			'body' => $body,
		] );

		if ( $update ) {
			Data::set_connect_mode_data( Data::TOKEN_ID, $data['id_token'] ?? null );
			Data::set_connect_mode_data( Data::ACCESS_TOKEN, $data['access_token'] ?? null );
			Data::set_connect_mode_data( Data::REFRESH_TOKEN, $data['refresh_token'] ?? null );
			Data::set_connect_mode_data( Data::OPTION_OWNER_USER_ID, get_current_user_id() ?? null );
		}

		return $data;
	}

	public static function jwt_decode( $payload ) : string {
		static $jwks = null;

		$jwks_url = Utils::get_jwks_url();
		if ( ! $jwks_url ) {
			return __( 'Missing JWKS URL', 'pojo-accessibility' );
		}

		if ( ! $jwks ) {
			$jwks = self::request($jwks_url, [
				'method' => 'GET',
			]);
		}
		if ( ! class_exists( 'JWT' ) ) {
			require_once EA11Y_PATH . 'vendor/autoload.php';
			if ( ! class_exists( 'JWT' ) ) {
				return __( 'JWT class not found', 'pojo-accessibility' );
			}
		}

		try {
			$decoded = \Firebase\JWT\JWT::decode( $payload, \Firebase\JWT\JWK::parseKeySet( $jwks ) );
			return wp_json_encode( $decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		} catch ( \Throwable $th ) {
			if ( $th instanceof \Firebase\JWT\ExpiredException ) {
				self::get_token( GrantTypes::REFRESH_TOKEN, Data::get_refresh_token() );
				return self::jwt_decode( $payload );
			}
			return $th->getMessage();
		}
	}

	/**
	 * @param string $url
	 * @param array $args
	 * @param int $valid_response_code
	 *
	 * @return array|null
	 * @throws Service_Exception
	 */
	public static function request( string $url, array $args, int $valid_response_code = 200 ) : ?array {
		$args['timeout'] = 30;
		$args['headers'] = array_replace_recursive( [
			'x-elementor-app-type' => self::APP_TYPE,
		], $args['headers'] ?? [] );

		$response = wp_remote_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			Logger::error( $response->get_error_message() );

			throw new Service_Exception( esc_html( $response->get_error_message() ) );
		}

		if ( wp_remote_retrieve_response_code( $response ) !== $valid_response_code ) {
			Logger::error( 'Invalid status code ' . wp_remote_retrieve_response_code( $response ) );

			throw new Service_Exception( esc_html( wp_remote_retrieve_body( $response ) ) );
		}

		return json_decode( wp_remote_retrieve_body( $response ), true );
	}

	/**
	 * @throws Service_Exception
	 */
	public static function refresh_token() {
		self::get_token( GrantTypes::CLIENT_CREDENTIALS, null . true );
	}

	/**
	 * @throws Service_Exception
	 */
	public static function update_redirect_uri(): void {
		$client_id = Data::get_client_id();

		if ( ! $client_id ) {
			throw new Service_Exception( 'Missing client ID' );
		}

		$client_patch_url = Utils::get_clients_patch_url( $client_id );

		[ 'access_token' => $access_token ] = self::get_token(
			GrantTypes::CLIENT_CREDENTIALS,
			null,
			false
		);

		self::request( $client_patch_url, [
			'method' => 'PATCH',
			'headers' => [
				'Content-Type' => 'application/json',
				'Authorization' => "Bearer {$access_token}",
			],
			'body' => wp_json_encode( [
				'redirect_uri' => Utils::get_redirect_uri(),
			] ),
		] );

		self::refresh_token();

		Data::set_home_url();
	}
}
