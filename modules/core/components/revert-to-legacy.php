<?php

namespace EA11y\Modules\Core\Components;

use EA11y\Modules\Legacy\Components\Upgrade;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Revert_To_Legacy {
	const AJAX_ACTION = 'ea11y_revert';

	public function handle_ajax_revert() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => 'Unauthorized' ] );
		}

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['nonce'] ) ), self::AJAX_ACTION ) ) {
			wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
		}

		Upgrade::revert();

		// store upgrade campaign data
		if ( ! headers_sent() ) {
			wp_safe_redirect( admin_url( 'admin.php?page=accessibility-settings' ) );
			die();
		}
		wp_send_json_success( [] );
	}

	public function add_plugin_links( $links, $plugin_file_name ) {
		if ( ! str_ends_with( $plugin_file_name, '/pojo-accessibility.php' ) ) {
			return (array) $links;
		}

		$custom_links['revert'] = sprintf(
			'<a href="%s">%s</a>',
			admin_url( 'admin-ajax.php?action=' . self::AJAX_ACTION . '&nonce=' . wp_create_nonce( self::AJAX_ACTION ) ),
			esc_html__( 'Revert to legacy', 'pojo-accessibility' )
		);

		return array_merge( $links, $custom_links );
	}

	public function __construct() {
		if ( ! Upgrade::is_reverted() ) {
			add_action( 'wp_ajax_' . self::AJAX_ACTION, [ $this, 'handle_ajax_revert' ] );
			add_filter( 'plugin_action_links', [ $this, 'add_plugin_links' ], 11, 2 );
		}
	}
}
