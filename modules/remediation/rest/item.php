<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Classes\Utils as Global_Utils;
use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Table;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Item extends Route_Base {
	public string $path = 'item';

	public function get_methods(): array {
		return [ 'POST', 'PUT', 'PATCH', 'DELETE' ];
	}

	public function get_name(): string {
		return 'item';
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

			$remediation_data = (array) $request->get_param( 'remediation' );
			$rule = sanitize_text_field( $request->get_param( 'rule' ) );
			$group = sanitize_text_field( $request->get_param( 'group' ) );
			$api_id = sanitize_text_field( $request->get_param( 'apiId' ) );
			$is_global = (bool) $request->get_param( 'global' );

			$remediation = new Remediation_Entry( [
				'data' => [
					Remediation_Table::URL => $url,
					Remediation_Table::CATEGORY => $remediation_data['category'],
					Remediation_Table::RULE => $rule,
					Remediation_Table::GROUP => $group,
					Remediation_Table::CONTENT => wp_json_encode( $remediation_data ),
					Remediation_Table::ACTIVE => true,
					Remediation_Table::GLOBAL => $is_global,
				],
			] );

			Page_Entry::clear_cache( $url );

			$remediation->save();

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
				'remediation' => $remediation->get_data(),
				'message' => 'Remediation added',
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
	public function PUT( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$id = sanitize_text_field( $request->get_param( 'id' ) );
			$url = esc_url( $request->get_param( 'url' ) );
			$content = $request->get_param( 'content' );
			$is_global = (bool) $request->get_param( 'global' );

			Remediation_Entry::update_remediation_content( Remediation_Table::ID, $id, $content, $is_global );
			Page_Entry::clear_cache( $url );

			return $this->respond_success_json( [
				'message' => 'Remediation updated successfully',
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

			$id = sanitize_text_field( $request->get_param( 'id' ) );
			$url = esc_url( $request->get_param( 'url' ) );
			$active = filter_var( $request->get_param( 'active' ), FILTER_VALIDATE_BOOLEAN );

			Remediation_Entry::update_remediations_status( Remediation_Table::ID, $id, $active );
			Page_Entry::clear_cache( $url );

			return $this->respond_success_json( [
				'message' => 'Remediation status updated successfully',
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

			$id = sanitize_text_field( $request->get_param( 'id' ) );
			$url = esc_url( $request->get_param( 'url' ) );
			Remediation_Entry::remove( Remediation_Table::ID, $id );
			Page_Entry::clear_cache( $url );

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
