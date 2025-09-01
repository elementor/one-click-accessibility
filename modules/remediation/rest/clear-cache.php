<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Components\Cache_Cleaner;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Clear_Cache extends Route_Base {
	public string $path = 'clear-cache';

	public function get_methods(): array {
		return [ 'DELETE' ];
	}

	public function get_name(): string {
		return 'clear-cache';
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function DELETE( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$url = esc_url( $request->get_param( 'url' ) );
			if ( $url ) {
				Cache_Cleaner::clear_ally_url_cache( $url );
			} else {
				Cache_Cleaner::clear_ally_cache();
			}

			return $this->respond_success_json( [
				'message' => 'Cache cleared.',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
