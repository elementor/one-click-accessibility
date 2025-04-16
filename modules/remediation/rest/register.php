<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Page_Table;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Register extends Route_Base {
	public string $path = 'register';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'register';
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

			$page = new Page_Entry( [
				'data' => [
					Page_Table::URL => $request->get_param( 'url' ),
					Page_Table::OBJECT_ID => $request->get_param( 'object_id' ) ?? 0,
					Page_Table::OBJECT_TYPE => $request->get_param( 'object_type' ) ?? '',
					Page_Table::OBJECT_TYPE_NAME => $request->get_param( 'object_type_name' ) ?? '',
				],
			] );

			$page->save();

			if ( ! $page->exists() ) {
				return $this->respond_error_json( [
					'message' => 'Failed to register page',
					'code' => 'page_not_found',
				] );
			}

			return $this->respond_success_json( [
				'message' => 'Page registered successfully',
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
