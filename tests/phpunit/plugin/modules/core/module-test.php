<?php

namespace EA11y\Tests\Modules\Core;

use EA11y\Tests\Helpers\Module_Test_Base;

/**
 * Class Module
 */
class Module extends Module_Test_Base {
	public $name = 'core';

	public $components = [
		'Pointers',
		'Notices',
		'Skip_Link',
		'Revert_To_Legacy',
		'Svg',
		'Notificator',
	];
}
