<?php

namespace EA11y\Modules\Remediation;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Legacy\Module as LegacyModule;
use EA11y\Modules\Remediation\Database\Global_Remediation_Relationship_Table;
use EA11y\Modules\Remediation\Database\Page_Table;
use EA11y\Modules\Remediation\Database\Remediation_Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'remediation';
	}

	public static function is_active(): bool {

		if ( LegacyModule::is_active() ) {
			return false;
		}

		return Connect::is_connected();
	}

	public static function routes_list(): array {
		return [
			'Register',
			'Set_Alt_Text',
			'Items',
			'Item',
			'Global_Item',
			'Global_Items',
			'Global_Items_Group',
			'Trigger_Save',
			'Heading_Level',
			'Dismiss_Heading_Issue',
			'Clear_Cache',
		];
	}

	public static function component_list(): array {
		return [
			'Remediation_Runner',
			'Cache_Cleaner',
		];
	}

	public function run_migrations() {
		Page_Table::install();
		Remediation_Table::install();
		Global_Remediation_Relationship_Table::install();
	}

	/**
	 * Enqueue Scripts
	 */
	public function enqueue_assets() : void {
		if ( is_admin() ) {
			return;
		}

		Utils\Assets::enqueue_app_assets( 'remediation-module', false );
	}

	public function __construct() {
		$this->run_migrations();
		$this->register_routes();
		$this->register_components();

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );

	}
}
