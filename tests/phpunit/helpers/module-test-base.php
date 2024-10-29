<?php
namespace EA11y\Tests\Helpers;

use \Eunit\Cases\Module_Test;

/**
 * Class Module
 */
abstract class Module_Test_Base extends Module_Test {
	public $name = '';

	public $components = [];

	public $routes = [];

	public function test_routes() {
		/**
		 * @var Module_Base $module
		 */
		$module = $this->module;


		if ( ! method_exists( $module, 'routes_list' ) || empty( $module::routes_list() ) ) {
			$this->assertTrue( true, 'No routes to test' );
			return;
		}
		$routes = $module::routes_list();

		$this->assertTrue( is_array( $routes ),
			'Test that the routes are returned as an array'
		);

		$this->assertCount( count( $this->routes ), $routes,
			'Test that the number of routes are as expected'
		);

		foreach ( $this->routes as $route ) {
			$this->assertContains( $route, $routes,
				'Test that Route "' . $route . '" is registered'
			);
		}
	}

	public function test_components() {
		/**
		 * @var Module_Base $module
		 */
		$module = $this->module;
		if ( method_exists( $module, 'component_list' ) === false || empty( $module::component_list() ) ) {
			$this->assertTrue( true, 'No components to test' );
			return;
		}
		$components = $module::component_list();

		$this->assertTrue( is_array( $components ),
			'Test that the components are returned as an array'
		);

		$this->assertCount( count( $this->components ), $components,
			'Test that the number of components are as expected'
		);

		foreach ( $this->components as $component ) {
			$this->assertContains( $component, $components,
				'Test that component "' . $component . '" is registered'
			);
		}
	}

	/**
	 * test_constructor
	 */
	public function test_constructor() {
		$this->test_components();
		$this->test_routes();
	}
}
