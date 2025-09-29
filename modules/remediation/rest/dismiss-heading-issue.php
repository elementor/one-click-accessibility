<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Dismiss_Heading_Issue extends Route_Base {
	const META_KEY = 'ea11y-scanner-heading-issues-dismissed';
	public string $path = 'dismiss-heading-issue';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'dismiss-heading-issue';
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

			$post_id = (int) sanitize_text_field( $request->get_param( 'pageId' ) );
			$xpath = sanitize_text_field( $request->get_param( 'xpath' ) );

			if ( ! $post_id || ! $xpath ) {
				return $this->respond_error_json( [
					'message' => 'Missing required parameters',
					'code' => 'missing_parameters',
				] );
			}

			$data = get_post_meta( $post_id, self::META_KEY, true ) ?? [];

			if ( ! $data ) {
				$data = [];
			}

			$data[] = $xpath;

			update_post_meta( $post_id, self::META_KEY, array_unique( $data ) );

			return $this->respond_success_json( [
				'message' => 'Heading issue dismissed',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
