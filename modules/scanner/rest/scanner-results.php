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
    public function GET($request) {
        try {
            $error = $this->verify_capability();

            if ( $error ) {
                return $error;
            }

            $period = $request->get_param( 'period' ) ?? 30;
            $output = [];

            $pages_scanned = Page_Entry::get_pages( $period );

            foreach ( $pages_scanned as $page ) {
                $scans = Scan_Entry::get_scans( $page->url );

                $scans = array_map(function($scan) {
                    return [
                      'date' =>  $scan->created_at,
                      'issues_total' =>  $scan->summary['counts']['violation'] ?? 0,
                      'issues_fixed' =>  $scan->summary['counts']['manual'] ?? 0,
                    ];
                }, $scans);

                $output[] = [
                    'id' => $page->id,
                    'page_title' => $page->object_type === 'home' ?
                        __('Home', 'pojo-accessibility') :
                        get_the_title( $page->object_id ),
                    'page_url' => $page->url,
                    'scans' => $scans,
                    'last_scan' => $scans[0]['date'] ?: $page->created_at,
                    'issues_total' => $page->violations,
                    'issues_fixed' => $page->resolved,
                ];
            }

            return $this->respond_success_json($output);

        } catch ( Throwable $t ) {
            return $this->respond_error_json( [
                'message' => $t->getMessage(),
                'code' => 'internal_server_error',
            ] );
        }
    }
}
