<?php

namespace EA11y\Modules\Remediation\Rest;

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

class Items extends Route_Base {
	public string $path = 'items';

	public function get_methods(): array {
		return [ 'GET', 'PATCH', 'DELETE' ];
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
				'message' => 'Remediations received successfully',
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
	public function PATCH( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$url = esc_url( $request->get_param( 'url' ) );
			$active = filter_var( $request->get_param( 'active' ), FILTER_VALIDATE_BOOLEAN );
			$group = sanitize_text_field( $request->get_param( 'group' ) );

			Remediation_Entry::update_remediations_status( Remediation_Table::URL, $url, $active, $group );
			Page_Entry::clear_cache( $url );

			return $this->respond_success_json( [
				'message' => 'Remediations status updated successfully',
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

			$url = esc_url( $request->get_param( 'url' ) );
			$group = sanitize_text_field( $request->get_param( 'group' ) );
			Remediation_Entry::remove( Remediation_Table::URL, $url, $group );
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
