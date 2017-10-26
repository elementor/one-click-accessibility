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

	public function include_settings() {
		include( 'includes/pojo-a11y-settings.php' );
		new Pojo_A11y_Settings( 110 );
	}

	public function admin_notices() {
		echo '<div class="error"><p>' . sprintf( __( '<a href="%s" target="_blank">Pojo Theme</a> is not active. Please activate any theme by Pojo.me before you are using "Pojo Accessibility" plugin.', 'pojo-accessibility' ), 'http://pojo.me/' ) . '</p></div>';
	}

	public function print_update_error() {
		echo '<div class="error"><p>' . sprintf( __( 'The Pojo Accessibility is not supported by this version of %s. Please <a href="%s">upgrade the theme to its latest version</a>.', 'pojo-accessibility' ), Pojo_Core::instance()->licenses->updater->theme_name, admin_url( 'update-core.php' ) ) . '</p></div>';
	}

	public function bootstrap() {
		// This plugin for Pojo Themes..
		if ( ! class_exists( 'Pojo_Core' ) ) {
			add_action( 'admin_notices', array( &$this, 'admin_notices' ) );
			return;
		}

		if ( version_compare( '1.5.4', Pojo_Core::instance()->get_version(), '>' ) ) {
			add_action( 'admin_notices', array( &$this, 'print_update_error' ) );
			return;
		}
		
		include( 'includes/pojo-a11y-frontend.php' );
		include( 'includes/pojo-a11y-customizer.php' );
		
		$this->frontend   = new Pojo_A11y_Frontend();
		$this->customizer = new Pojo_A11y_Customizer();

		add_action( 'pojo_framework_base_settings_included', array( &$this, 'include_settings' ) );
	}

	private function __construct() {
		add_action( 'init', array( &$this, 'bootstrap' ) );
		add_action( 'plugins_loaded', array( &$this, 'load_textdomain' ) );
	}

}

Pojo_Accessibility::instance();