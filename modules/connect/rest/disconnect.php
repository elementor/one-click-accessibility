<?php

namespace EA11y\Modules\Connect\Rest;

use EA11y\Modules\Connect\Classes\{
	Route_Base,
	Service,
};

use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Disconnect
 */
class Disconnect extends Route_Base {
	public string $path = 'disconnect';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'disconnect';
	}

	public function POST() {
		try {
			Service::refresh_token();
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
