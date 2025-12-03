<?php

namespace EA11y\Modules\Dashboard;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use EA11y\Classes\Module_Base;
use EA11y\Modules\Dashboard\Widgets\Ally_Dashboard_Widget;

class Module extends Module_Base {
	public function get_name(): string {
		return 'dashboard';
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		// Add Ally dashboard widget
		Ally_Dashboard_Widget::init();
	}
}
