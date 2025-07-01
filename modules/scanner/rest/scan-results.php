<?php

namespace EA11y\Modules\Scanner\Rest;

use EA11y\Classes\Utils as Global_Utils;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Page_Table;
use EA11y\Modules\Scanner\Classes\Route_Base;
use EA11y\Modules\Scanner\Database\Scan_Entry;
use EA11y\Modules\Scanner\Database\Scans_Table;
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

			$scan = new Scan_Entry([
				'data' => [
					Scans_Table::URL => $url,
					Scans_Table::SUMMARY => wp_json_encode( $summary ),
				],
			]);

			$page = new Page_Entry( [
				'by' => Page_Table::URL,
				'value' => $url,
			] );
			$page->update_stats( $summary['counts']['violation'] );

			$scan->save();

			return $this->respond_success_json( [
				'message' => 'Scan results added',
				'scanId' => $scan->id,
			] );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
