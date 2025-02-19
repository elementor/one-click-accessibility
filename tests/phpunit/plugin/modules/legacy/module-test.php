<?php
namespace EA11y\Tests\Modules\Logs;

use EA11y\Tests\Helpers\Module_Test_Base;

/**
 * Class Module
 */
class Module extends Module_Test_Base {
	public $name = 'legacy';

	public $components = [
		'Frontend',
		'Customizer',
		'Settings',
		'Admin',
		'Upgrade'
	];

	public $routes = [];
}
