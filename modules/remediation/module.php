<?php

namespace EA11y\Modules\Remediation;

use EA11y\Classes\Utils;
use EA11y\Classes\Module_Base;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Remediation\Database\Page_Table;
use EA11y\Modules\Settings\Classes\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'remediation';
	}

	public static function is_active(): bool {
		return Connect::is_connected();
	}

	public static function routes_list(): array {
		return [
			'Register',
			'Set_Alt_Text',
			'Add_Remediation',
		];
	}

	public static function component_list(): array {
		return [
			'Remediations_Runner',
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

	public function enqueue_scanner_wizard() {
		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		wp_enqueue_script(
			'ea11y-scanner-wizard',
			self::get_scanner_wizard_url() . '?api_key=' . $plan_data->public_api_key,
			[],
			EA11Y_VERSION,
			true
		);
	}

	public function __construct() {
		Page_Table::install();
		$this->register_routes();
		$this->register_components();
		$this->enqueue_scanner_wizard();
	}
}
