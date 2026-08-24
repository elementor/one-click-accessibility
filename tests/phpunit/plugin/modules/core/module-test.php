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

	public function test_add_plugin_links_with_null_links_for_other_plugin() {
		$result = $this->module->add_plugin_links( null, 'some-other-plugin/some-other-plugin.php' );

		$this->assertNull( $result );
	}

	public function test_add_plugin_links_with_null_links_for_ally() {
		$result = $this->module->add_plugin_links( null, 'pojo-accessibility/pojo-accessibility.php' );

		$this->assertNull( $result );
	}

	public function test_add_plugin_links_merges_existing_links_for_ally() {
		$existing_links = [ 'deactivate' => '<a href="#">Deactivate</a>' ];
		$result = $this->module->add_plugin_links( $existing_links, 'pojo-accessibility/pojo-accessibility.php' );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'settings', $result );
		$this->assertArrayHasKey( 'deactivate', $result );
		$this->assertSame( $existing_links['deactivate'], $result['deactivate'] );
	}
}
