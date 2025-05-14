<?php

namespace EA11y\Modules\Settings\Rest;

use EA11y\Modules\Settings\Classes\Route_Base;
use EA11y\Modules\Settings\Module as Settings;
use Throwable;
use WP_Error;
use WP_REST_Response;
use WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Get_Media extends Route_Base {
	public string $path = 'get-media';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'get-media';
	}

	/**
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response | WP_Error
	 */
	public function POST( WP_REST_Request $request ) {

		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$url = esc_url_raw( $request->get_body() );

			$response = Settings::get_media( $url );

			return $this->respond_success_json( $response['body'] );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
