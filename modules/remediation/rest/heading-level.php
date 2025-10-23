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

class Heading_Level extends Route_Base {
	public string $path = 'heading-level';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'heading-level';
	}

	/**
	 * @return WP_Error|WP_REST_Response
	 */
	public function POST( $request ) {
		try {
			$error = $this->verify_capability();

			if ( $error ) {
				return $error;
			}

			$url = esc_url( $request->get_param( 'url' ) );
			$level = sanitize_text_field( $request->get_param( 'level' ) );
			$xpath = sanitize_text_field( $request->get_param( 'xpath' ) );
			$rule = sanitize_text_field( $request->get_param( 'rule' ) ) ?? '';

			// Remove existing remediations for this xpath before creating new ones
			$this->remove_existing_remediations( $url, $xpath );

			if ( 'p' === $level ) {
				$this
					->create_remediation_entry( $url, $rule, [
						'xpath' => $xpath,
						'attribute_name' => 'role',
						'attribute_value' => 'presentation',
					] )
					->save();
			} else {
				$this
					->create_remediation_entry( $url, $rule, [
						'xpath' => $xpath,
						'attribute_name' => 'role',
						'attribute_value' => 'heading',
					] )
					->save();

				$this
					->create_remediation_entry( $url, $rule, [
						'xpath' => $xpath,
						'attribute_name' => 'aria-level',
						'attribute_value' => trim( $level, 'h' ),
					] )
					->save();
			}

			Page_Entry::clear_cache( $url );

			return $this->respond_success_json( [
				'message' => 'Remediation added',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}

	private function remove_existing_remediations( string $url, string $xpath ): void {
		$existing_entries = Remediation_Entry::get_page_remediations( $url )['page'];

		foreach ( $existing_entries as $entry ) {
			if ( isset( $entry->group ) && 'headingStructure' === $entry->group ) {
				$content = json_decode( $entry->content, true );

				if ( isset( $content['xpath'] ) &&
					$content['xpath'] === $xpath &&
					isset( $content['type'] ) &&
					'ATTRIBUTE' === $content['type'] &&
					isset( $content['attribute_name'] ) &&
					in_array( $content['attribute_name'], [ 'role', 'aria-level' ], true )
				) {
					Remediation_Table::delete( [ 'id' => $entry->id ] );
				}
			}
		}
	}

	private function create_remediation_entry( string $url, string $rule, array $data ): Remediation_Entry {
		return new Remediation_Entry( [
			'data' => [
				Remediation_Table::URL => $url,
				Remediation_Table::CATEGORY => 'A',
				Remediation_Table::RULE => $rule,
				Remediation_Table::GROUP => 'headingStructure',
				Remediation_Table::CONTENT => wp_json_encode( array_merge( [
					'category' => 'A',
					'type' => 'ATTRIBUTE',
					'action' => 'update',
				], $data ) ),
				Remediation_Table::ACTIVE => true,
			],
		] );
	}
}
