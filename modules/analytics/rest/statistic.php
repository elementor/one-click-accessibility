<?php

namespace EA11y\Modules\Analytics\Rest;

use DateTime;
use EA11y\Modules\Analytics\Classes\Route_Base;
use EA11y\Modules\Analytics\Database\Analytics_Entry;

use Throwable;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Statistic extends Route_Base {
	protected $auth = true;
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

		$enabled_periods = [ 0, 1, 7, 30 ];
		$params = $request->get_query_params();
		$period = sanitize_text_field( $params['period'] );
		if ( ! in_array( $period, $enabled_periods, true ) ) {
			$this->respond_error_json([
				'message' => esc_html__( 'Bad request.', 'pojo-accessibility' ),
				'code' => 400,
			]);
		}

		try {
			$date = new DateTime();
			$date->modify( "-$period days" )->setTime( 0, 0, 0, 0 );
			$date_from = $date->format( 'Y-m-d H:i:s' );
			$result = [
				'dates' => Analytics_Entry::get_data_dates_grouped( $date_from ),
				'elements' => Analytics_Entry::get_data_events_grouped( $date_from ),
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
