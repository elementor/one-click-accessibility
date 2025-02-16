<?php

namespace EA11y\Modules\Analytics\Rest;

use EA11y\Classes\Logger;
use EA11y\Modules\Analytics\Classes\Route_Base;
use EA11y\Modules\Analytics\Database\Analytics_Entry;
use EA11y\Modules\Analytics\Database\Analytics_Table;
use EA11y\Modules\Analytics\Module as AnalyticsModule;
use Throwable;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Event extends Route_Base {
	protected $auth = false;
	public string $path = 'event';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'event';
	}

	/**
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function POST( WP_REST_Request $request ): WP_REST_Response {
		try {
			$params = $request->get_json_params();
			$error = $this->verify_nonce( $request->get_header( AnalyticsModule::NONCE_HEADER ), AnalyticsModule::NONCE_NAME );

			if ( ! $error && Analytics_Entry::validate_item( $params['event'], $params['element'] ) ) {
				$analytics_entry = new Analytics_Entry([
					'data' => [
						Analytics_Table::EVENT => $params['event'],
						Analytics_Table::ELEMENT => $params['element'],
						Analytics_Table::VALUE => $params['value'],
					],
				]);
				$analytics_entry->create();
			}
		} catch ( Throwable $t ) {
			Logger::info( $t->getMessage() );
		}
		return new WP_REST_Response( null, 200 );
	}
}
