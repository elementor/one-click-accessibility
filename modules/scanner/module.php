<?php

namespace EA11y\Modules\Scanner;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Scanner\Database\Scans_Table;
use EA11y\Modules\Settings\Classes\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'scanner';
	}

	public static function component_list(): array {
		return [
			'Top_Bar_Link',
		];
	}

	/**
	 * Get widget URL
	 * @return string
	 */
	public static function get_scanner_wizard_url() : string {
		return apply_filters( 'ea11y_scanner_wizard_url', 'https://cdn.elementor.com/a11y/scanner.js' );
	}

	/**
	 * Enqueue Scripts
	 */
	public function enqueue_scripts() : void {

		if ( is_admin() || ! is_admin_bar_showing() ) {
			return;
		}

		if ( version_compare( get_bloginfo( 'version' ), '6.6', '<' ) ) {
			wp_register_script(
				'react-jsx-runtime',
				EA11Y_ASSETS_URL . 'lib/react-jsx-runtime.js',
				[ 'react' ],
				'18.3.0',
				true
			);
		}

		Utils\Assets::enqueue_app_assets( 'scanner', false );

		wp_localize_script(
			'scanner',
			'ea11yScannerData',
			[
				'wpRestNonce' => wp_create_nonce( 'wp_rest' ),
				'scannerUrl' => self::get_scanner_wizard_url(),
				'planData' => Settings::get( Settings::PLAN_DATA ),
			]
		);
	}


	public function __construct() {
		Scans_Table::install();
		$this->register_components();
		$this->enqueue_scripts();
	}
}
