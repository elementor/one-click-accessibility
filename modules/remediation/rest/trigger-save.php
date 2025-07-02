<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Classes\Utils;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Trigger_Save extends Route_Base {
	public string $path = 'trigger-save';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'trigger-save';
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

			$object_id = sanitize_text_field( $request->get_param( 'object_id' ) );
			$object_type = sanitize_text_field( $request->get_param( 'object_type' ) );
			Utils::trigger_save_for_clean_cache( $object_id, $object_type );

			return $this->respond_success_json( [
				'message' => 'Entry save triggered',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
