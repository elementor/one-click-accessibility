<?php

namespace EA11y\Modules\Reviews\Rest;

use EA11y\Modules\Reviews\Classes\Feedback_Handler;
use EA11y\Modules\Reviews\Classes\Route_Base;
use Throwable;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


class Feedback extends Route_Base {
	public string $path = 'review';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'feedback';
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function POST( WP_REST_Request $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$params = $request->get_json_params();
			// Prepare for use
			$params['feedback'] = sanitize_text_field( $params['feedback'] );
			$params['rating'] = sanitize_text_field( $params['rating'] );
			$params['app_name'] = 'ally';

			$response = Feedback_Handler::post_feedback( $params );

			return $this->respond_success_json( $response );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
