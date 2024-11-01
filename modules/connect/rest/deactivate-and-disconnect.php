<?php

namespace EA11y\Modules\Connect\Rest;

use EA11y\Modules\Connect\Classes\{
	Data,
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
class Deactivate_And_Disconnect extends Route_Base {
	public string $path = 'deactivate_and_disconnect';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'deactivate_and_disconnect';
	}

	public function POST( WP_REST_Request $request ) {
		try {
			if ( $request->get_param( 'clear_session' ) ) {
				Data::clear_session( true );
				return $this->respond_success_json();
			}

			Service::deactivate_license();
			Service::disconnect();

			return $this->respond_success_json();
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
