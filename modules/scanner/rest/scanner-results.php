<?php

namespace EA11y\Modules\Scanner\Rest;

use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Scanner\Classes\Route_Base;
use EA11y\Modules\Scanner\Database\Scan_Entry;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Scanner_Results extends Route_Base {
	public string $path = 'results';

	public function get_methods(): array {
		return [ 'GET' ];
	}

	public function get_name(): string {
		return 'results';
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function GET() {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$output = [];

			$pages_scanned = Page_Entry::get_pages();

			foreach ( $pages_scanned as $page ) {
				$scans = Scan_Entry::get_scans( $page->url );
				$page_remediation_count = Remediation_Entry::get_page_remediations_count( $page->url );

				$scans = array_map(function( $scan ) {
					return [
						'date' => $scan->created_at,
						'issues_total' => $scan->summary['counts']['violation'] ?? 0,
						'issues_fixed' => $scan->summary['counts']['issuesResolved'] ?? 0,
					];
				}, $scans);

				// Filter scans within the last 60 days
				$recent_scans = array_filter($scans, function( $scan ) {
					return strtotime( $scan['date'] ) >= strtotime( '-60 days' );
				});

				if ( empty( $recent_scans ) ) {
					continue;
				}

				$output[] = [
					'id' => $page->id,
					'page_title' => $page->title ? $page->title : ( 'home' === $page->object_type ?
						__( 'Home', 'pojo-accessibility' ) :
						get_the_title( $page->object_id ) ), // left old expression for backward compatibility
					'page_url' => $page->url,
					'scans' => $scans,
					'last_scan' => $scans[0]['date'] ?: $page->created_at,
					'remediation_count' => $page_remediation_count,
					'issues_total' => $scans[0]['issues_total'],
					'issues_fixed' => $scans[0]['issues_fixed'],
				];
			}

			return $this->respond_success_json( $output );

		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
