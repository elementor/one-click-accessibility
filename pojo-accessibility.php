<?php
/*
Plugin Name: Pojo Accessibility
Plugin URI: http://pojo.me/
Description: This plugin implements the accessibility tools for themes by Pojo Framework
Author: Pojo Team
Author URI: http://pojo.me/
Version: 1.1.6
Text Domain: pojo-accessibility
Domain Path: /languages/
*/
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define( 'POJO_A11Y__FILE__', __FILE__ );
define( 'POJO_A11Y_BASE', plugin_basename( POJO_A11Y__FILE__ ) );
define( 'POJO_A11Y_URL', plugins_url( '/', POJO_A11Y__FILE__ ) );
define( 'POJO_A11Y_ASSETS_PATH', plugin_dir_path( POJO_A11Y__FILE__ ) . 'assets/' );
define( 'POJO_A11Y_ASSETS_URL', POJO_A11Y_URL . 'assets/' );
define( 'POJO_A11Y_CUSTOMIZER_OPTIONS', 'pojo_a11y_customizer_options' );

final class Pojo_Accessibility {

	/**
	 * @var Pojo_Accessibility The one true Pojo_Accessibility
	 * @since 1.0.0
	 */
	private static $_instance = null;

	/**
	 * @var Pojo_A11y_Frontend
	 */
	public $frontend;

	/**
	 * @var Pojo_A11y_Customizer
	 */
	public $customizer;

	/**
	 * @var Pojo_A11y_Settings
	 */
	public $settings;

	public function load_textdomain() {
		load_plugin_textdomain( 'pojo-accessibility', false, basename( dirname( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'pojo-accessibility' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'pojo-accessibility' ), '1.0.0' );
	}

	/**
	 * @return Pojo_Accessibility
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function bootstrap() {

		include( 'includes/pojo-a11y-frontend.php' );
		include( 'includes/pojo-a11y-customizer.php' );
		include( 'includes/pojo-a11y-settings.php' );

		$this->frontend   = new Pojo_A11y_Frontend();
		$this->customizer = new Pojo_A11y_Customizer();
		$this->settings = new Pojo_A11y_Settings();
	}

	public function backwards_compatibility() {
		if ( false === get_option( POJO_A11Y_CUSTOMIZER_OPTIONS, false ) ) {
			$customizer_fields = $this->customizer->get_customizer_fields();
			$defaults = array();
			foreach ( $customizer_fields as $field ) {
				$theme_mod = get_theme_mod( $field['id'], false );
				if ( false === $theme_mod ) {
					$defaults[ $field['id'] ] = $field['std'];
				}
				$defaults[ $field['id'] ] = $theme_mod;
			}
			update_option( POJO_A11Y_CUSTOMIZER_OPTIONS, $defaults );
		}
	}

	private function __construct() {
		add_action( 'init', array( &$this, 'bootstrap' ) );
		add_action( 'admin_init', array( &$this, 'backwards_compatibility' ) );
		add_action( 'plugins_loaded', array( &$this, 'load_textdomain' ) );
	}

}

Pojo_Accessibility::instance();
