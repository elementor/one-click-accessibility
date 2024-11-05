<?php
/*
Plugin Name: One Click Accessibility
Plugin URI: https://wpaccessibility.io/?utm_source=wp-plugins&utm_campaign=plugin-uri&utm_medium=wp-dash
Description: The One Click Accessibility toolbar is the fastest plugin to help you make your WordPress website more accessible.
Author: One Click Accessibility
Author URI: https://wpaccessibility.io/?utm_source=wp-plugins&utm_campaign=author-uri&utm_medium=wp-dash
Version: 2.1.0
Text Domain: pojo-accessibility
Domain Path: /languages/
*/
if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

// Legacy
define( 'POJO_A11Y_CUSTOMIZER_OPTIONS', 'pojo_a11y_customizer_options' );

define( 'EA11Y_VERSION', '2.1.0' );
define( 'EA11Y_MAIN_FILE', __FILE__ );
define( 'EA11Y_BASE', plugin_basename( EA11Y_MAIN_FILE ) );
define( 'EA11Y_PATH', plugin_dir_path( __FILE__ ) );
define( 'EA11Y_URL', plugins_url( '/', __FILE__ ) );
define( 'EA11Y_ASSETS_PATH', EA11Y_PATH . 'assets/' );
define( 'EA11Y_ASSETS_URL', EA11Y_URL . 'assets/' );

final class Pojo_Accessibility {

	/**
	 * @var Pojo_Accessibility The one true Pojo_Accessibility
	 * @since 1.0.0
	 */
	public static $instance = null;

	public function i18n() {
		load_plugin_textdomain( 'pojo-accessibility' );
	}

	/**
	 * Throw error on object clone
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 * @return void
	 * @since 1.0.0
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'pojo-accessibility' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 * @return void
	 * @since 1.0.0
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'pojo-accessibility' ), '1.0.0' );
	}

	/**
	 * @return Pojo_Accessibility
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Initialize the plugin
	 * Do your Validations here:
	 * for example checks for basic plugin requirements, if one check fail don't continue,
	 * if all check have passed include the plugin class.
	 * Fired by `plugins_loaded` action hook.
	 * @since 2.2.0
	 * @access public
	 */
	public function init() {
		// Once we get here, We have passed all validation checks, so we can safely include our plugin
		require_once 'plugin.php';
	}

	private function __construct() {
		// Load translation
		add_action( 'init', [ $this, 'i18n' ] );

		// Init Plugin
		add_action( 'plugins_loaded', [ $this, 'init' ] );
	}

}

Pojo_Accessibility::instance();
