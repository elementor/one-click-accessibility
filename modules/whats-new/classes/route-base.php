<?php

namespace EA11y\Modules\WhatsNew\Classes;

use EA11y\Classes\Rest\Route;
use WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Route_Base extends Route {
	protected $auth = true;
	protected string $path = '';
	protected bool $override = false;

	public function get_methods(): array {
		return [];
	}

	public function get_endpoint(): string {
		return 'whats-new/' . $this->get_path();
	}

	public function get_path(): string {
		return $this->path;
	}

	public function get_name(): string {
		return '';
	}

	public function get_permission_callback( WP_REST_Request $request ): bool {
		$valid = $this->permission_callback( $request );

		return $valid && user_can( $this->current_user_id, 'manage_options' );
	}
}
