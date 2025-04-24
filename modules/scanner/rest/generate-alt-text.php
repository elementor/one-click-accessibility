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

			$image = $request->get_param( 'image' );
			$svg = $request->get_param( 'svg' );

			if ( ! ( $image || $svg ) ) {
				return $this->respond_error_json( [
					'message' => 'Missing required parameters',
					'code' => 'missing_parameters',
				] );
			}

			$src = $image ?? Utils::create_tmp_file_from_png_base64( $svg );

			$result =  Global_Utils::get_api_client()->make_request(
				'POST',
				'ai/image-alt',
				[],
				[],
				false,
				$src
			);

			return $this->respond_success_json( [
				'message' => 'Alt text generated',
				'data' => $result->response,
			] );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
