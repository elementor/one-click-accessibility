<?php

namespace EA11y\Modules\WhatsNew;

use EA11y\Classes\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	public function get_name(): string {
		return 'whats-new';
	}

	public static function component_list(): array {
		return [
			'Notificator',
		];
	}
	public static function routes_list() : array {
		return [
			'Get_Notifications',
		];
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_routes();
		$this->register_components();
	}
}
