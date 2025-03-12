<?php

namespace EA11y\Modules\Scanner;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Scanner\Database\Scans_Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'scanner';
	}

	public function __construct() {
		Scans_Table::install();
	}
}
