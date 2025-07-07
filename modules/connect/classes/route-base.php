<?php

namespace EA11y\Modules\Connect\Classes;

use EA11y\Classes\Rest\Route;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Route_Base
 */
class Route_Base extends Route {
	protected bool $override = false;
	protected $auth = true;
	protected string $path = '';
	public function get_methods(): array {
		return [];
	}

	public function get_endpoint(): string {
		return 'connect/' . $this->get_path();
	}

	public function get_path(): string {
		return $this->path;
	}

	public function get_name(): string {
		return '';
	}

	public function post_permission_callback( \WP_REST_Request $request ) : bool {
		return $this->get_permission_callback( $request );
	}

	public function get_permission_callback( \WP_REST_Request $request ) : bool {
		$valid = $this->permission_callback( $request );

		return $valid && user_can( $this->current_user_id, 'manage_options' );
	}
}
