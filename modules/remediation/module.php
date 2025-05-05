<?php

namespace EA11y\Modules\Remediation;

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
			'Remediation_Runner',
		];
	}

	public function __construct() {
		Page_Table::install();
		$this->register_routes();
		$this->register_components();
	}
}
