<?php

namespace EA11y\Tests\Modules\Core\Components;

use EA11y\Modules\Core\Components\Revert_To_Legacy as Tested_Component;
use Eunit\Cases\Unit_Test;

class Revert_To_Legacy extends Unit_Test {

	private ?Tested_Component $revert_to_legacy = null;

	public function setUp(): void {
		parent::setUp();

		$this->revert_to_legacy = new Tested_Component();
	}

	public function tearDown(): void {
		parent::tearDown();

		$this->revert_to_legacy = null;
	}

	public function test_add_plugin_links_with_null_links_for_other_plugin() {
		$result = $this->revert_to_legacy->add_plugin_links( null, 'some-other-plugin/some-other-plugin.php' );

		$this->assertNull( $result );
	}

	public function test_add_plugin_links_with_null_links_for_ally() {
		$result = $this->revert_to_legacy->add_plugin_links( null, 'pojo-accessibility/pojo-accessibility.php' );

		$this->assertNull( $result );
	}

	public function test_add_plugin_links_merges_existing_links_for_ally() {
		$existing_links = [ 'deactivate' => '<a href="#">Deactivate</a>' ];
		$result = $this->revert_to_legacy->add_plugin_links( $existing_links, 'pojo-accessibility/pojo-accessibility.php' );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'revert', $result );
		$this->assertArrayHasKey( 'deactivate', $result );
		$this->assertSame( $existing_links['deactivate'], $result['deactivate'] );
	}
}
