<?php

namespace EA11y\Modules\Remediation\rest;

use EA11y\Classes\Utils as Global_Utils;
use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Table;
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
			$url = $request->get_param( 'url' );
			$page = $this->get_page_entry( $url );

			if ( ! $page ) {
				return $this->respond_error_json( [
					'message' => 'Missing page',
					'code' => 'page_not_found',
				] );
			}

			$remediation_data = (array) $request->get_param( 'remediation' );
			$api_id = sanitize_text_field( $request->get_param( 'apiId' ) );
			$remediation = new Remediation_Entry( [
				'data' => [
					Remediation_Table::URL => $url,
					Remediation_Table::CONTENT => wp_json_encode( $remediation_data ),
				],
			] );

			$remediation->save();
			$page->save();

			if ( $api_id ) {
				Global_Utils::get_api_client()->make_request(
					'POST',
					'ai/resolve/' . $api_id,
					[],
					[],
					true,
				);
			}

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
