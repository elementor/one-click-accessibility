<?php

namespace EA11y\Modules\Scanner\Rest;

use EA11y\Classes\Utils as Global_Utils;
use EA11y\Modules\Scanner\Classes\Route_Base;
use EA11y\Modules\Scanner\Database\Scan_Entry;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Scan_Results extends Route_Base {
	public string $path = 'scan-results';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'scan-results';
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

			$url = esc_url_raw( $request->get_param( 'url' ) );
			$summary = Global_Utils::sanitize_object( $request->get_param( 'summary' ) );

			$scan = new Scan_Entry();
			$scan->add_record( $url, $summary );

			return $this->respond_success_json( [
				'message' => 'Scan results added',
			] );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
