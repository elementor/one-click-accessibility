<?php

namespace EA11y;

use EA11y\Classes\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

final class Manager {
	/**
	 * @var Module_Base[]
	 */
	private array $modules = [];

	public static function get_module_list(): array {
		return [
			'Legacy',
			'Connect',
			'Settings',
			'Widget',
			'Core',
			'Analytics',
			'whats-new',
			'Remediation',
			'Scanner',
			'Deactivation',
			'Reviews',
		];
	}

	/**
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		$modules = self::get_module_list();

		foreach ( $modules as $module_name ) {
			$class_name = str_replace( '-', ' ', $module_name );
			$class_name = str_replace( ' ', '', ucwords( $class_name ) );
			$class_name = __NAMESPACE__ . '\\Modules\\' . $class_name . '\Module';

			/** @var Module_Base $class_name */
			if ( method_exists( $class_name, 'register_required_routes' ) ) {
				$class_name::register_required_routes();
			}
			if ( $class_name::is_active() ) {
				$this->modules[ $module_name ] = $class_name::instance();
			}
		}
	}

	/**
	 * @param string $module_name
	 *
	 * @return Module_Base|Module_Base[]
	 */
	public function get_modules( string $module_name ) {
		if ( $module_name ) {
			if ( isset( $this->modules[ $module_name ] ) ) {
				return $this->modules[ $module_name ];
			}

			return null;
		}

		return $this->modules;
	}
}
