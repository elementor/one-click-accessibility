<?php

namespace EA11y\Modules\Analytics;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Analytics\Database\Analytics_Table;

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
			'Event',
			'Statistic',
		];
	}

	public function __construct() {
		// TODO: add condition to check for PRO version

		$this->register_components();
		$this->register_routes();

		// this make sure the database table is created and or updated when needed
		Analytics_Table::install();
	}
}
