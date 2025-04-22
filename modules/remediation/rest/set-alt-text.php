<?php

namespace EA11y\Modules\Remediation\Rest;

use EA11y\Modules\Remediation\Classes\Route_Base;
use Throwable;
use WP_Error;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Set_Alt_Text extends Route_Base {
	const ALT_TEXT_META_KEY = '_wp_attachment_image_alt';
	public string $path = 'set-alt-text';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'set-alt-text';
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
			$alt_text = sanitize_text_field( $request->get_param( 'alt_text' ) );

			if ( ! $url ) {
				return $this->respond_error_json( [
					'message' => 'Missing required parameters',
					'code' => 'missing_parameters',
				] );
			}

			$attachment_id = attachment_url_to_postid( $url );
			$attachment = get_post( $attachment_id );
			if ( ! $attachment ) {
				return $this->respond_error_json( [
					'message' => 'Attachment not found',
					'code' => 'attachment_not_found',
				] );
			}

			update_post_meta( $attachment_id, self::ALT_TEXT_META_KEY, $alt_text );

			return $this->respond_success_json( [
				'message' => 'Alt text updated',
			] );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
