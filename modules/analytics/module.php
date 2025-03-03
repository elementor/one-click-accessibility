<?php

namespace EA11y\Modules\Analytics;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Analytics\Database\Analytics_Table;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Settings\Module as SettingsModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Module
 */
class Module extends Module_Base {

	/**
	 * Get module name.
	 * Retrieve the module name.
	 * @access public
	 * @return string Module name.
	 */
	public function get_name(): string {
		return 'analytics';
	}

	public static function component_list(): array {
		return [
			'Analytics_Daily',
		];
	}


	public static function routes_list() : array {
		return [
			'Events',
			'Statistic',
		];
	}

	public static function is_active(): bool {
		$plan_data = Settings::get( Settings::PLAN_DATA );
		$is_analytics_enabled = Settings::get( Settings::ANALYTICS_SETTINGS );
		return 'Free Trial' !== $plan_data->plan->name && $is_analytics_enabled;
	}

	public function __construct() {
		$this->register_components();
		$this->register_routes();

		// this make sure the database table is created and or updated when needed
		Analytics_Table::install();
	}
}
