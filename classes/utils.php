<?php

namespace EA11y\Classes;
use EA11y\Classes\Services\Client;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Utils {

	public static function get_api_client(): ?Client {
		return Client::get_instance();
	}

	public static function is_plugin_page(): bool {
		$current_screen = get_current_screen();

		return str_contains( $current_screen->id, 'ea11y-' );
	}
	public static function user_is_admin(): bool {
		return current_user_can( 'manage_options' );
	}
	public static function is_wp_dashboard_page(): bool {
		$current_screen = get_current_screen();

		return str_contains( $current_screen->id, 'dashboard' );
	}

	public static function is_wp_settings_page(): bool {
		$current_screen = get_current_screen();

		return str_contains( $current_screen->id, 'options-' );
	}

	public static function is_elementor_installed() {
		$file_path = 'elementor/elementor.php';
		$installed_plugins = get_plugins();
		return isset( $installed_plugins[ $file_path ] );
	}

}
