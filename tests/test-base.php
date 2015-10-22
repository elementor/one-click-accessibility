<?php

class Pojo_A11y_Test_Base extends WP_UnitTestCase {

	public function test_plugin_activated() {
		$this->assertTrue( is_plugin_active( PLUGIN_PATH ) );
	}

	public function test_getInstance() {
		$this->assertInstanceOf( 'Pojo_Accessibility', Pojo_Accessibility::instance() );
	}

}