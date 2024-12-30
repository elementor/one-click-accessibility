<?php

namespace EA11y\Modules\Core\Components;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Pointers {
	const DISMISSED_POINTERS_META_KEY = 'ea11y_dismissed_pointers';

	public function dismiss_pointers() {
		if ( empty( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'ea11y-pointer-dismissed' ) ) {
			wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
		}

		$pointer = sanitize_text_field( $_POST['data']['pointer'] ) ?? null;

		if ( empty( $pointer ) ) {
			wp_send_json_error( [ 'message' => 'The pointer id must be provided' ] );
		}

		$pointer = explode( ',', $pointer );

		$user_dismissed_meta = get_user_meta( get_current_user_id(), self::DISMISSED_POINTERS_META_KEY, true );

		if ( ! $user_dismissed_meta ) {
			$user_dismissed_meta = [];
		}

		foreach ( $pointer as $item ) {
			$user_dismissed_meta[ $item ] = true;
		}

		update_user_meta( get_current_user_id(), self::DISMISSED_POINTERS_META_KEY, $user_dismissed_meta );

		wp_send_json_success( [] );
	}

	public static function is_dismissed( string $slug ): bool {
		$meta = (array) get_user_meta( get_current_user_id(), self::DISMISSED_POINTERS_META_KEY, true );

		return key_exists( $slug, $meta );
	}

	public function __construct() {
		add_action( 'wp_ajax_ea11y_pointer_dismissed', [ $this, 'dismiss_pointers' ] );
	}
}
