<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Classes\Utils as Global_Utils;
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

			$url = esc_url_raw( $request->get_param( 'url' ) );
			$page = new Page_Entry([
				'by' => 'url',
				'value' => $url,
			]);

			// Prevent creating duplicate entry
			if ( $page->exists() ) {
				return new WP_REST_Response( null, 204 );
			}

			$page = new Page_Entry( [
				'data' => [
					Page_Table::URL => $url,
					Page_Table::TITLE => sanitize_text_field( $request->get_param( 'title' ) ) ?? '',
					Page_Table::OBJECT_ID => sanitize_text_field( $request->get_param( 'object_id' ) ) ?? 0,
					Page_Table::OBJECT_TYPE => sanitize_text_field( $request->get_param( 'object_type' ) ) ?? '',
					Page_Table::OBJECT_TYPE_NAME => sanitize_text_field( $request->get_param( 'object_type_name' ) ) ?? '',
					Page_Table::STATUS => Page_Table::STATUSES['ACTIVE'],
				],
			] );

			$response = Global_Utils::get_api_client()->make_request(
				'POST',
				'scanned-page/store',
				[
					'page_url' => $url,
					'summary' => Global_Utils::sanitize_object( $request->get_param( 'summary' ) ),
				],
				[],
				true,
			);

			if ( ! is_wp_error( $response ) ) {
				$page->save();
			}

			if ( is_wp_error( $response ) && str_contains( $response->get_error_message(), 'Quota exceeded' ) ) {
				return $this->respond_error_json( [
					'message' => 'Quota exceeded',
				] );
			}

			if ( ! $page->exists() || is_wp_error( $response ) ) {
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
