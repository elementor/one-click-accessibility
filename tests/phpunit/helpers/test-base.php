<?php
namespace EA11y\Tests\Helpers;

use \Eunit\Cases\Unit_Test;

/**
 * Class Module
 */
abstract class Test_Base extends Unit_Test {
	public function setUp() : void {
		parent::setUp();
		// Users
		$this->subscriber = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		$this->editor = $this->factory->user->create( [ 'role' => 'editor' ] );
		$this->administrator = $this->factory->user->create( [ 'role' => 'administrator' ] );

		// Factories
		$this->factory->log = new \WP_UnitTest_Factory_For_Log( $this->factory );
	}


	/**
	 * tearDown
	 */
	public function tearDown() : void {
		parent::tearDown();
	}

	public function get_plugin() {
		return \EA11y\Plugin::instance();
	}

	public function get_plugin_module( $name ) {
		/**
		 * @var Module_Base $module
		 */
		$module = '\EA11y\\Modules\\' . $name . '\Module';
		return $module::instance();
	}
}
