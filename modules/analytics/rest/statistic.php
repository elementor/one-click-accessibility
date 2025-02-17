<?php

namespace EA11y\Modules\Analytics\Rest;

use EA11y\Classes\Logger;
use EA11y\Modules\Analytics\Classes\Route_Base;
use EA11y\Modules\Analytics\Database\Analytics_Entry;
use EA11y\Modules\Analytics\Database\Analytics_Table;
use Throwable;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Statistic extends Route_Base {
	protected $auth = false;
	public string $path = 'statistic';

	public function get_methods(): array {
		return [ 'GET' ];
	}

	public function get_name(): string {
		return 'statistic';
	}

	/**
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response | WP_Error
	 */
	public function GET( WP_REST_Request $request ) {
		$error = $this->verify_capability();

		if ( $error ) {
			return $error;
		}

		try {
			$params = $request->get_query_params();
			$result = [
				'dates' => Analytics_Entry::get_data_dates_grouped( $params['period'] ),
				'elements' => Analytics_Entry::get_data_events_grouped( $params['period'] ),
			];
			return $this->respond_success_json( $result );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
