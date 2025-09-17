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
	public static function user_is_admin(): bool {
		return current_user_can( 'manage_options' );
	}

	public static function sanitize_object( $input ) {
		// Convert an object to array if needed
		if ( is_object( $input ) ) {
			$input = (array) $input;
		}

		// Recursively sanitize
		array_walk_recursive($input, function ( &$value ) {
			if ( is_string( $value ) ) {
				$value = sanitize_text_field( $value );
			}
		});

		return $input;
	}
}
