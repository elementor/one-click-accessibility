<?php
/**
 * Plugin Name: Ally - Web Accessibility & Usability
 * Plugin URI: https://elementor.com/
 * Description: Improve your website’s accessibility with ease. Customize capabilities such as text resizing, contrast modes, link highlights, and easily generate an accessibility statement to demonstrate your commitment to inclusivity.
 * Author: Elementor.com
 * Author URI: https://elementor.com/
 * Version: 3.9.0
 * Text Domain: pojo-accessibility
 * Domain Path: /languages/
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

// Legacy
define( 'POJO_A11Y_CUSTOMIZER_OPTIONS', 'pojo_a11y_customizer_options' );
define( 'EA11Y_VERSION', '3.9.0' );
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
		// Init Plugin
		add_action( 'plugins_loaded', [ $this, 'init' ] );
	}

}

Pojo_Accessibility::instance();
