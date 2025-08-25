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

class Scanner_Stats extends Route_Base {
	public string $path = 'stats';

	public function get_methods(): array {
		return [ 'GET' ];
	}

	public function get_name(): string {
		return 'stats';
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function GET( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$period = $request->get_param( 'period' ) ?? 30;
			$output = [
				'scans' => 0,
				'issues_total' => 0,
				'issues_fixed' => 0,
				'issue_levels' => [
					'a' => 0,
					'aa' => 0,
					'aaa' => 0,
				],
				'issue_by_category' => [
					'altText' => 0,
					'dynamicContent' => 0,
					'formsInputsError' => 0,
					'keyboardAssistiveTech' => 0,
					'pageStructureNav' => 0,
					'tables' => 0,
					'colorContrast' => 0,
					'other' => 0,
				],
			];

			$pages_scanned = Page_Entry::get_pages();
			$remediations = Remediation_Entry::get_all_remediations( $period );

			foreach ( $pages_scanned as $page ) {
				$scans = Scan_Entry::get_scans( $page->url );
				$recent_scans = array_filter( $scans, function ( $scan ) use ( $period ) {
					$scan_date = strtotime( $scan->created_at );
					return $scan_date >= strtotime( "-$period days" );
				} );

				if ( count( $recent_scans ) > 0 ) {
					$output['scans'] ++;
					$output['issues_total'] += $recent_scans[0]->summary['counts']['violation'] ?? 0;
					$output['issues_fixed'] += $recent_scans[0]->summary['counts']['issuesResolved'] ?? 0;
				}
			}

			foreach ( $remediations as $remediation ) {
				$output['issue_levels'][ strtolower( $remediation->category ) ] ++;
				
				// Map group to the correct key format expected by frontend
				$group = $remediation->group;
				if ( isset( $output['issue_by_category'][ $group ] ) ) {
					$output['issue_by_category'][ $group ] ++;
				} else {
					$output['issue_by_category']['other'] ++;
				}
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
