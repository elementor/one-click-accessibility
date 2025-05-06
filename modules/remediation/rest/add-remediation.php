<?php

namespace EA11y\Modules\Remediation\rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Classes\Utils;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Add_Remediation extends Route_Base {
	public string $path = 'add-remediation';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'add-remediation';
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

			$page = $this->get_page_entry( $request->get_param( 'url' ) );

			if ( ! $page ) {
				return $this->respond_error_json( [
					'message' => 'Missing page',
					'code' => 'page_not_found',
				] );
			}

			$remediation = Utils::sanitize_object( $request->get_param( 'remediation' ) );
			$page->append_remediation( $remediation );

			return $this->respond_success_json( [
				'message' => 'Remediation added',
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
