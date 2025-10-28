<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Global_Remediation_Relationship_Entry;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Table;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Global_Items extends Route_Base {
	public string $path = 'global-items';

	public function get_methods(): array {
		return [ 'PUT', 'PATCH', 'DELETE' ];
	}

	public function get_name(): string {
		return $this->path;
	}

	/**
	 * Enable/Disable all global remediation for single page
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function PUT( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$active = filter_var( $request->get_param( 'active' ), FILTER_VALIDATE_BOOLEAN );
			$url = esc_url( $request->get_param( 'url' ) );
			$remediations = Remediation_Entry::get_global_remediations_ids();

			foreach ( $remediations as $remediation ) {
				$relationship = Global_Remediation_Relationship_Entry::get_relationship_entry( $url, $remediation->id );
				$relationship->update_status( $url, $remediation->id, $active );
			}

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
	 * Enable/Disable all global remediation for all scanned pages
	 * @return WP_Error|WP_REST_Response
	 *
	 */
	public function PATCH( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$active = filter_var( $request->get_param( 'active' ), FILTER_VALIDATE_BOOLEAN );

			$remediations = Remediation_Entry::get_global_remediations_ids();

			foreach ( $remediations as $remediation ) {
				Remediation_Entry::update_remediations_status( Remediation_Table::ID, $remediation->id, $active, null, true );
				Global_Remediation_Relationship_Entry::update_status_for_all_pages( $remediation->id, $active );
			}

			Page_Entry::clear_all_cache();

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

			$group = sanitize_text_field( $request->get_param( 'group' ) );
			Remediation_Entry::remove_all_global( $group );
			Page_Entry::clear_all_cache();

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
