<?php

namespace EA11y\Modules\Connect\Components;

use EA11y\Modules\Connect\Classes\{
	Config,
	Data,
	GrantTypes,
	Service,
	Utils,
};
use EA11y\Classes\Logger;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Handler
 */
class Handler {
	private function should_handle_auth_code(): bool {
		global $plugin_page;

		$page_slug = explode( 'page=', Config::ADMIN_PAGE );

		$is_connect_admin_page = false;

		if ( ! empty( $page_slug[1] ) && $page_slug[1] === $plugin_page ) {
			$is_connect_admin_page = true;
		}

		if ( ! $is_connect_admin_page && Config::ADMIN_PAGE === $plugin_page ) {
			$is_connect_admin_page = true;
		}

		if ( ! $is_connect_admin_page ) {
			return false;
		}

		$code = $_GET['code'] ?? null;
		$state = $_GET['state'] ?? null;

		if ( empty( $code ) || empty( $state ) ) {
			return false;
		}

		return true;
	}

	private function validate_nonce( $state ) {
		if ( ! wp_verify_nonce( $state, Config::STATE_NONCE ) ) {
			wp_die( 'Invalid state' );
		}
	}

	public function handle_auth_code() {
		if ( ! $this->should_handle_auth_code() ) {
			return;
		}

		$code = sanitize_text_field( $_GET['code'] );
		$state = sanitize_text_field( $_GET['state'] );

		// Check if the state is valid
		$this->validate_nonce( $state );

		try {
			// Exchange the code for an access token and store it
			Service::get_token( GrantTypes::AUTHORIZATION_CODE, $code ); // Makes sure we won't stick in the mismatch limbo

			Data::set_home_url();

			do_action( 'on_connect_' . Config::APP_PREFIX . '_connected' ); // Redirect to the redirect URI
		} catch ( Throwable $t ) {
			Logger::error( 'Unable to handle auth code: ' . $t->getMessage() );
		}

		wp_redirect( Utils::get_redirect_uri() );

		exit;
	}

	/**
	 * Handler constructor.
	 */
	public function __construct() {
		add_action( 'admin_init', [ $this, 'handle_auth_code' ] );
	}
}
