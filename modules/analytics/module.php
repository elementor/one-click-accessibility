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

	public const NONCE_HEADER = 'X-WP-Nonce';
	public const NONCE_NAME = 'wp_rest';

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
			'Data',
		];
	}

	public static function get_analytics_settings() {
		// TODO: add condition to check for PRO version
		return [
			'header' => self::NONCE_HEADER,
			'_wpNonce' => wp_create_nonce( self::NONCE_NAME ),
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
