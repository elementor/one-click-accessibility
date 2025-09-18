<?php

namespace EA11y\Modules\Scanner\Rest;

use EA11y\Modules\Scanner\Classes\Route_Base;
use EA11y\Modules\Scanner\Database\Scan_Entry;
use EA11y\Modules\Scanner\Database\Scans_Table;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Resolve_Issue extends Route_Base {
	public string $path = 'resolve-issue';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'resolve-issue';
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

			$scan_id = $request->get_param( 'scanId' );
			$scan = Scan_Entry::get_by_id( $scan_id );

			if ( empty( $scan ) ) {
				return $this->respond_error_json( [
					'message' => 'Scan not found',
					'code' => 'not_found',
				] );
			}

			$summary = $scan->summary;

			if ( $summary['counts']['issuesResolved'] + 1 <= $summary['counts']['violation'] ) {
				$summary['counts']['issuesResolved']++;
				Scan_Entry::update_scan_summary( Scans_Table::ID, $scan_id, json_encode( $summary ) );
			}

			return $this->respond_success_json( [
				'message' => 'Resolved',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
