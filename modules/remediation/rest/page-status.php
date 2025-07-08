<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Page_Entry;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Page_Status extends Route_Base {
	public string $path = 'page-status';

	public function get_methods(): array {
		return [ 'PATCH' ];
	}

	public function get_name(): string {
		return 'page-status';
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function PATCH( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$url = esc_url_raw( $request->get_param( 'url' ) );
			$status = sanitize_text_field( $request->get_param( 'status' ) );
			$page = new Page_Entry([
				'by' => 'url',
				'value' => $url,
			]);

			// Prevent creating duplicate entry
			if ( ! $page->exists() ) {
				return $this->respond_error_json( [
					'message' => 'Failed to update page',
					'code' => 'page_not_found',
				] );
			}

			$page->update_status( $status );

			return $this->respond_success_json( [
				'message' => 'Page updated successfully',
				'data' => $page->to_json(),
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
