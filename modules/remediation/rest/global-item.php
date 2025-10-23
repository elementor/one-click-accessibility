<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use EA11y\Modules\Remediation\Database\Exclude_Remediation_Relationship_Entry;
use EA11y\Modules\Remediation\Database\Exclude_Remediation_Relationship_Table;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Table;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Global_Item extends Route_Base {
	public string $path = 'global-item';

	public function get_methods(): array {
		return [ 'PUT', 'PATCH' ];
	}

	public function get_name(): string {
		return $this->path;
	}

	/**
	 * Enable/Disable global remediation for all single page
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
			$exclude = filter_var( $request->get_param( 'exclude' ), FILTER_VALIDATE_BOOLEAN );
			$url = esc_url( $request->get_param( 'url' ) );

			if ( $exclude ) {
				$relationship = new Exclude_Remediation_Relationship_Entry([
					'data' => [
						Exclude_Remediation_Relationship_Table::PAGE_URL => $url,
						Exclude_Remediation_Relationship_Table::REMEDIATION_ID => $id,
					],
				]);
				$relationship->save();
			} else {
				Exclude_Remediation_Relationship_Entry::remove( $url, $id );
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
	 * Enable/Disable global remediation for all scanned pages
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
			$active = filter_var( $request->get_param( 'active' ), FILTER_VALIDATE_BOOLEAN );

			Remediation_Entry::update_remediations_status( Remediation_Table::ID, $id, $active );
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
}
