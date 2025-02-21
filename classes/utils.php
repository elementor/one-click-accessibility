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

	public static function is_plugin_settings_page(): bool {
		$current_screen = get_current_screen();
		return str_contains( $current_screen->id, 'toplevel_page_accessibility-settings' );
	}

	public static function is_elementor_installed() :bool {
		$file_path = 'elementor/elementor.php';
		$installed_plugins = get_plugins();
		return isset( $installed_plugins[ $file_path ] );
	}
}
