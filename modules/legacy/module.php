<?php

namespace EA11y\Modules\Legacy;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Legacy\Components\Customizer;
use EA11y\Modules\Legacy\Components\Settings;
use EA11y\Modules\Legacy\Components\Upgrade;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	public function get_name(): string {
		return 'legacy';
	}

	public static function component_list() : array {
		return [
			'Frontend',
			'Customizer',
			'Settings',
			'Admin',
			'Upgrade',
		];
	}

	public function backwards_compatibility() {
		if ( false === get_option( POJO_A11Y_CUSTOMIZER_OPTIONS, false ) ) {
			/**
			 * @var Customizer $customizer
			 */
			$customizer = $this->get_components()['Customizer'];
			$customizer_fields = $customizer->get_customizer_fields();
			$options = [];
			$mods = get_theme_mods();
			foreach ( $customizer_fields as $field ) {
				if ( isset( $mods[ $field['id'] ] ) ) {
					$options[ $field['id'] ] = $mods[ $field['id'] ];
				} else {
					$options[ $field['id'] ] = $field['std'];
				}
			}
			update_option( POJO_A11Y_CUSTOMIZER_OPTIONS, $options );
		}
	}

	public function add_elementor_support() {
		$this->register_components( [ 'Elementor'  ] );
	}

	public static function get_settings() {
		/**
		 * @var Settings $settings
		 */
		return Plugin::instance()->modules_manager->get_modules( 'Legacy' )->get_component( 'Settings' );
	}

	public static function is_active(): bool {
		if (
			( Upgrade::has_legacy_data() && ! Upgrade::is_upgraded() && ! Connect::is_connected() )
			|| Upgrade::is_reverted()
		) {
			return true;
		}
		return false;
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_components();
		add_action( 'admin_init', [ $this, 'backwards_compatibility' ] );
		add_action( 'elementor/init', [ $this, 'add_elementor_support' ] );
	}
}
