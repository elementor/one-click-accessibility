<?php

namespace EA11y\Modules\Settings\Rest;

use EA11y\Modules\Settings\Classes\Route_Base;
use EA11y\Modules\Settings\Module as Settings;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Get_Settings extends Route_Base {
	public string $path = 'get-settings';

	public function get_methods(): array {
		return [ 'GET' ];
	}

	public function get_name(): string {
		return 'get-settings';
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function GET() {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$data = Settings::get_plugin_settings();

			return $this->respond_success_json( $data );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
