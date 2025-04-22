<?php

namespace EA11y\Modules\Scanner\Rest;

use EA11y\Modules\Scanner\Classes\Route_Base;
use EA11y\Modules\Scanner\Classes\Utils;
use EA11y\Classes\Utils as Global_Utils;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Generate_Alt_Text extends Route_Base {
	public string $path = 'generate-alt-text';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'generate-alt-text';
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

			$image = Utils::sanitize_base64_image( $request->get_param( 'image' ) );

			if ( ! $image ) {
				return $this->respond_error_json( [
					'message' => 'Wrong image format',
					'code' => 'internal_server_error',
				] );
			}

			return Global_Utils::get_api_client()->make_request(
				'POST',
				'ai/image-alt',
				[ 'image' => $image ]
			);

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
