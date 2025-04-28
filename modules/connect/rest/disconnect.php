<?php

namespace EA11y\Modules\Connect\Rest;

use EA11y\Modules\Settings\Module as Settings;
use EA11y\Modules\Connect\Classes\{
	Route_Base,
	Service,
};

use Throwable;
use WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Disconnect
 */
class Disconnect extends Route_Base {
	public string $path = 'disconnect';
	public const NONCE_NAME = 'wp_rest';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'disconnect';
	}

	public function POST( WP_REST_Request $request ) {
		$valid = $this->verify_nonce_and_capability(
			$request->get_param( self::NONCE_NAME ),
			self::NONCE_NAME
		);

		if ( is_wp_error( $valid ) ) {
			return $this->respond_error_json( [
				'message' => $valid->get_error_message(),
				'code' => 'forbidden',
			] );
		}

		try {
			Service::refresh_token();
			Service::disconnect();
			Settings::delete_plan_data_refresh_transient();

			return $this->respond_success_json();
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
