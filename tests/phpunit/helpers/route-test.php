<?php
namespace EA11y\Tests\Helpers;

use Eunit\Cases\Rest_Route_Test;

/**
 * Class Module
 */
abstract class Rest_Route_Unit_Test extends Rest_Route_Test {
	public $namespace = '/ea11y/v1';
	public $namespaced_route = '/ea11y/v1';
	public $endpoint = '';
	public $name = '';
	public $methods = [  ];
	public $class_name = '';
	public $module_name = '';

	public function setUp() : void {
		parent::setUp();
		// We must set up $this->route with an actual instance of the route class we are testing
		$this->route = $this->get_plugin_module( $this->module_name )->routes[ $this->class_name ];

		/**
		 * this includes automated unit tests for:
		 * - Test that the route is registered
		 * - Test route name is correct
		 * - Test allowed methods are correct
		 * - Test Endpoint is configured correctly
		 */
	}
}
