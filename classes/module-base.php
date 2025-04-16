<?php

namespace EA11y\Classes;

use EA11y\Modules\Legacy\Module as LegacyModule;
use ReflectionClass;
use ReflectionException;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Module Base.
 *
 * An abstract class providing the properties and methods needed to
 * manage and handle modules in inheriting classes.
 *
 * @abstract
 */
abstract class Module_Base {

	/**
	 * Module class reflection.
	 *
	 * Holds the information about a class.
	 * @access private
	 *
	 * @var ReflectionClass
	 */
	private $reflection = null;

	/**
	 * Module components.
	 *
	 * Holds the module components.
	 * @access private
	 *
	 * @var array
	 */
	private $components = [];

	/**
	 * Module routes.
	 *
	 * Holds the module registered routes.
	 * @access public
	 *
	 * @var array
	 */
	public $routes = [];

	/**
	 * Module instance.
	 *
	 * Holds the module instance.
	 * @access protected
	 *
	 * @var Module_Base[]
	 */
	// @phpcs:ignore
	protected static $_instances = [];

	/**
	 * Get module name.
	 *
	 * Retrieve the module name.
	 * @access public
	 * @abstract
	 *
	 * @return string Module name.
	 */
	abstract public function get_name();

	/**
	 * Instance.
	 *
	 * Ensures only one instance of the module class is loaded or can be loaded.
	 * @access public
	 * @static
	 *
	 * @return Module_Base An instance of the class.
	 */
	public static function instance() {
		$class_name = static::class_name();

		if ( empty( static::$_instances[ $class_name ] ) ) {
			static::$_instances[ $class_name ] = new static(); // @codeCoverageIgnore
		}

		return static::$_instances[ $class_name ];
	}

	public static function set_instance( $instance ) {
		$class_name = static::class_name();
		static::$_instances[ $class_name ] = $instance;
	}

	/**
	 * is_active
	 * @access public
	 * @static
	 * @return bool
	 */
	public static function is_active(): bool {
		return ! LegacyModule::is_active();
	}

	/**
	 * Class name.
	 *
	 * Retrieve the name of the class.
	 * @access public
	 * @static
	 */
	public static function class_name() {
		return get_called_class();
	}

	/**
	 * Clone.
	 *
	 * Disable class cloning and throw an error on object clone.
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object. Therefore, we don't want the object to be cloned.
	 *
	 * @access public
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Something went wrong.', 'pojo-accessibility' ), '0.0.1' ); // @codeCoverageIgnore
	}

	/**
	 * Wakeup.
	 *
	 * Disable un-serializing of the class.
	 * @access public
	 */
	public function __wakeup() {
		// un-serializing instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Something went wrong.', 'pojo-accessibility' ), '0.0.1' ); // @codeCoverageIgnore
	}

	/**
	 * @access public
	 */
	public function get_reflection() {
		if ( null === $this->reflection ) {
			try {
				$this->reflection = new ReflectionClass( $this );
			} catch ( ReflectionException $e ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
					error_log( $e->getMessage() );
				}
			}
		}

		return $this->reflection;
	}

	/**
	 * Add module component.
	 *
	 * Add new component to the current module.
	 * @access public
	 *
	 * @param string $id       Component ID.
	 * @param mixed  $instance An instance of the component.
	 */
	public function add_component( $id, $instance ) {
		$this->components[ $id ] = $instance;
	}

	/**
	 * Add module route.
	 *
	 * Add new route to the current module.
	 * @access public
	 *
	 * @param string $id       Route ID.
	 * @param mixed  $instance An instance of the route.
	 */
	public function add_route( string $id, $instance ) {
		$this->routes[ $id ] = $instance;
	}

	/**
	 * @access public
	 * @return Module[]
	 */
	public function get_components(): array {
		return $this->components;
	}

	/**
	 * Get module component.
	 *
	 * Retrieve the module component.
	 * @access public
	 *
	 * @param string $id Component ID.
	 *
	 * @return mixed An instance of the component, or `false` if the component
	 *               doesn't exist.
	 * @codeCoverageIgnore
	 */
	public function get_component( $id ) {
		if ( isset( $this->components[ $id ] ) ) {
			return $this->components[ $id ];
		}

		return false;
	}

	/**
	 * Retrieve the namespace of the class
	 *
	 * @access public
	 * @static
	 */
	public static function namespace_name() {
		$class_name = static::class_name();
		return substr( $class_name, 0, strrpos( $class_name, '\\' ) );
	}



	public static function routes_list() : array {
		return [];
	}

	public static function component_list() : array {
		return [];
	}

	/**
	 * Adds an array of components.
	 * Assumes namespace structure contains `\Components\`
	 *
	 * @param array $components_ids => component's class name.
	 */
	public function register_components( $components_ids = null ) {
		$namespace = static::namespace_name();
		$components_ids = $components_ids ?? static::component_list();
		foreach ( $components_ids as $component_id ) {
			$class_name = $namespace . '\\Components\\' . $component_id;
			$this->add_component( $component_id, new $class_name() );
		}
	}

	/**
	 * Adds an array of routes.
	 * Assumes namespace structure contains `\Rest\`
	 */
	public function register_routes() {
		$namespace = static::namespace_name();
		$routes_ids = static::routes_list();

		foreach ( $routes_ids as $route_id ) {
			$class_name = $namespace . '\\Rest\\' . $route_id;
			$this->add_route( $route_id, new $class_name() );
		}
	}
}

