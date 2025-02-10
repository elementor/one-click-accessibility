<?php

namespace EA11y\Classes\Services;

use EA11y\Modules\Connect\Classes\Data;
use EA11y\Modules\Connect\Classes\Exceptions\Service_Exception;
use EA11y\Modules\Connect\Classes\Service;
use EA11y\Modules\Connect\Module as Connect;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Client
 */
class Client {
	private const BASE_URL = 'https://my.elementor.com/apps/api/v1/a11y/';

	private bool $refreshed = false;

	public static ?Client $instance = null;

	/**
	 * set_instance
	 * used for testing
	 * @param $instance
	 */
	public static function set_instance( $instance ) {
		self::$instance = $instance;
	}

	/**
	 * get_instance
	 * @return Client|null
	 */
	public static function get_instance(): ?Client {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public static function get_site_info(): array {
		return [
			// Which API version is used.
			'app_version' => EA11Y_VERSION,
			// Which language to return.
			'site_lang' => get_bloginfo( 'language' ),
			// site to connect
			'site_url' => trailingslashit( home_url() ),
			// current user
			'local_id' => get_current_user_id(),
			// User Agent
			'user_agent' => ! empty( $_SERVER['HTTP_USER_AGENT'] )
				? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) )
				: 'Unknown',
			'webhook_url' => self::webhook_endpoint(),
		];
	}

	/**
	 * Log update endpoint
	 * @return string
	 */
	private static function webhook_endpoint(): string {
		$blog_id = get_current_blog_id();
		return get_rest_url( $blog_id, 'a11y/v1/webhooks/common' );
	}

	public function make_request( $method, $endpoint, $body = [], array $headers = [], $send_json = false ) {
		$headers = array_replace_recursive( [
			'x-elementor-a11y' => EA11Y_VERSION,
			'x-elementor-apps' => 'a11y',
		], $headers );

		$headers = array_replace_recursive(
			$headers,
			$this->is_connected() ? $this->generate_authentication_headers( $endpoint ) : []
		);

		$body = array_replace_recursive( $body, $this->get_site_info() );

		if ( $send_json ) {
			$headers['Content-Type'] = 'application/json';
			$body = wp_json_encode( $body );
		}

		return $this->request(
			$method,
			$endpoint,
			[
				'timeout' => 100,
				'headers' => $headers,
				'body' => $body,
			]
		);
	}

	public static function get_client_base_url() {
		return apply_filters( 'ea11y_client_base_url', self::BASE_URL );
	}

	private static function get_remote_url( $endpoint ): string {
		return self::get_client_base_url() . $endpoint;
	}

	protected function is_connected(): bool {
		return Connect::is_connected();
	}

	public function add_bearer_token( $headers ) {
		if ( $this->is_connected() ) {
			$headers['Authorization'] = 'Bearer ' . Data::get_access_token();
		}
		return $headers;
	}

	protected function generate_authentication_headers( $endpoint ): array {
		$headers = [
			'endpoint' => $endpoint,
		];

		return $this->add_bearer_token( $headers );
	}

	/**
	 * @throws Service_Exception
	 */
	protected function request( $method, $endpoint, $args = [] ) {
		$args['method'] = $method;

		$response = wp_remote_request(
			self::get_remote_url( $endpoint ),
			$args
		);

		if ( is_wp_error( $response ) ) {
			$message = $response->get_error_message();

			return new WP_Error(
				$response->get_error_code(),
				is_array( $message ) ? join( ', ', $message ) : $message
			);
		}

		$body = wp_remote_retrieve_body( $response );
		$response_code = (int) wp_remote_retrieve_response_code( $response );

		if ( ! $response_code ) {
			return new WP_Error( 500, 'No Response' );
		}

		// Server sent a success message without content.
		if ( 'null' === $body ) {
			$body = true;
		}

		// Return with no content on successful deletion of domain from service.
		if ( 204 === $response_code ) {
			$body = true;
			return $body;
		}

		$body = json_decode( $body );

		if ( false === $body ) {
			return new WP_Error( 422, 'Wrong Server Response' );
		}

		// If the token is invalid, refresh it and try again once only.
		if ( ! $this->refreshed && ! empty( $body->message ) && ( false !== strpos( $body->message, 'Invalid Token' ) ) ) {
			Service::refresh_token();
			$this->refreshed = true;
			$args['headers'] = $this->add_bearer_token( $args['headers'] );
			return $this->request( $method, $endpoint, $args );
		}

		if ( ! in_array( $response_code, [ 200, 201 ], true ) ) {
			// In case $as_array = true.
			$message = $body->message ?? wp_remote_retrieve_response_message( $response );
			$message = is_array( $message ) ? join( ', ', $message ) : $message;
			$code = isset( $body->code ) ? (int) $body->code : $response_code;

			return new WP_Error( $code, $message );
		}

		return $body;
	}

	/**
	 * get_site_data
	 * @return mixed|WP_Error  Site data
	 */
	public static function get_site_data() {
		return self::get_instance()->make_request( 'POST', 'stats' );
	}

	/**
	 * register_website
	 * @return mixed|WP_Error  Site data
	 */
	public static function register_website() {
		return self::get_instance()->make_request( 'POST', 'site' );
	}
}
