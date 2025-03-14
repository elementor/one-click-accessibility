<?php

namespace EA11y\Modules\Remediation;

use EA11y\Classes\Utils;
use EA11y\Classes\Module_Base;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Remediation\Database\Page_Table;

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

		Utils\Assets::enqueue_app_assets( 'remediation', false );
	}

	public function __construct() {
		Page_Table::install();
		$this->register_routes();
		$this->register_components();
		$this->enqueue_scripts();
	}
}
