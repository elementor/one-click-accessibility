<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Classes\Utils as Global_Utils;
use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Page_Table;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Table;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Items extends Route_Base {
	public string $path = 'items';

	public function get_methods(): array {
		return [ 'GET', 'POST', 'PATCH', 'DELETE' ];
	}

	public function get_name(): string {
		return 'items';
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

			$url = esc_url( $request->get_param( 'url' ) );
			$remediations = Remediation_Entry::get_page_remediations( $url );

			return $this->respond_success_json( [
				'message' => 'Remediation disabled',
				'data'    => $remediations,
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
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
			$url = esc_url( $request->get_param( 'url' ) );
			$page = $this->get_page_entry( $url );

			if ( ! $page ) {
				return $this->respond_error_json( [
					'message' => 'Missing page',
					'code' => 'page_not_found',
				] );
			}

			$remediation_data = (array) $request->get_param( 'remediation' );
			$rule = sanitize_text_field( $request->get_param( 'rule' ) );
			$group = sanitize_text_field( $request->get_param( 'group' ) );
			$api_id = sanitize_text_field( $request->get_param( 'apiId' ) );
			$remediation = new Remediation_Entry( [
				'data' => [
					Remediation_Table::URL => $url,
					Remediation_Table::CATEGORY => $remediation_data['category'],
					Remediation_Table::RULE => $rule,
					Remediation_Table::GROUP => $group,
					Remediation_Table::CONTENT => wp_json_encode( $remediation_data ),
					Remediation_Table::ACTIVE => true,
				],
			] );

			$page->__set( Page_Table::FULL_HTML, null );

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

			$ids = $request->get_json_params();
			Remediation_Entry::disable_remediations( $ids );

			return $this->respond_success_json( [
				'message' => 'Remediation disabled',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}

	/**
	 *
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function DELETE( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$id = sanitize_text_field( $request->get_json_params() );
			Remediation_Entry::remove( $id );

			return $this->respond_success_json( [
				'message' => 'Remediation deleted successfully',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
