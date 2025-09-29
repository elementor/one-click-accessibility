<?php

namespace EA11y\Modules\Scanner\Rest;

use EA11y\Classes\Utils as Global_Utils;
use EA11y\Modules\Scanner\Classes\Route_Base;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Resolve_With_AI extends Route_Base {
	public string $path = 'resolve-with-ai';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'resolve-with-ai';
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function POST( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$snippet = $request->get_param( 'snippet' );
			$violation = $request->get_param( 'violation' );
			$context = $request->get_param( 'context' );

			$result = Global_Utils::get_api_client()->make_request(
				'POST',
				'ai/remediate',
				[
					'snippet' => $snippet,
					'violation' => $violation,
					'htmlContext' => $context,
				],
				[],
				true,
			);

			if ( is_wp_error( $result ) ) {
				return $this->respond_error_json( [
					'message' => 'Failed to resolve with AI',
					'code' => 'internal_server_error',
				] );
			}

			return $this->respond_success_json( [
				'message' => 'Resolved with AI',
				'data' => [
					'response' => $result->response,
					'apiId' => $result->apiId,
				],
			] );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
