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

class Scanner_Post_Types extends Route_Base {
    public string $path = 'post-types';

    public function get_methods(): array {
        return [ 'GET' ];
    }

    public function get_name(): string {
        return 'post-types';
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

            $post_types = get_post_types( [ 'public' => true ], 'objects' );
            $taxonomies = get_taxonomies( [ 'public' => true ], 'objects' );

            $post_types = array_map(function($post_type) {
                return [
                    'label' => $post_type->label,
                    'url' => admin_url( 'edit.php?post_type=' . $post_type->name ),
                ];
            }, $post_types);

            $taxonomies = array_map(function($post_type) {
                return [
                    'label' => $post_type->label,
                    'url' => admin_url( 'edit-tags.php?taxonomy=' . $post_type->name ),
                ];
            }, $taxonomies);

            return $this->respond_success_json( array_merge($post_types, $taxonomies) );

        } catch ( Throwable $t ) {
            return $this->respond_error_json( [
                'message' => $t->getMessage(),
                'code' => 'internal_server_error',
            ] );
        }
    }
}
