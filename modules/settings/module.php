<?php

namespace EA11y\Modules\Settings;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	const SETTING_PREFIX     = 'a11y_';
	const SETTING_GROUP      = 'a11y_settings';
	const SETTING_BASE_SLUG  = 'accessibility-settings-2'; //TODO: Change this later
	const SETTING_CAPABILITY = 'manage_options';

	public function get_name(): string {
		return 'settings';
	}

	public function render_top_bar() {
		if ( 'toplevel_page_accessibility-settings-2' !== get_current_screen()->id ) {
			return;
		}

		?>
		<div id="ea11y-app-top-bar"></div>
		<?php
	}

	public function render_app() {
		?>
		<!-- The hack required to wrap WP notifications -->
		<div class="wrap">
			<h1 style="display: none;" role="presentation"></h1>
		</div>

		<div id="ea11y-app"></div>
		<?php
	}

	public function register_page() {
		add_menu_page(
			__( 'Accessibility New', 'pojo-accessibility' ), //TODO: Change this later
			__( 'Accessibility New', 'pojo-accessibility' ),
			self::SETTING_CAPABILITY,
			self::SETTING_BASE_SLUG,
			[ $this, 'render_app' ],
			'dashicons-universal-access-alt',
		);

		add_submenu_page(
			self::SETTING_BASE_SLUG,
			__( 'Accessibility Settings', 'pojo-accessibility' ),
			__( 'Settings', 'pojo-accessibility' ),
			self::SETTING_CAPABILITY,
			self::SETTING_BASE_SLUG,
			[ $this, 'render_app' ],
		);
	}

	/**
	 * Enqueue Scripts and Styles
	 */
	public function enqueue_scripts( $hook ) {
		if ( 'toplevel_page_accessibility-settings-2' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'ea11y-admin-fonts',
			'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
			[],
			EA11Y_VERSION
		);

		Utils\Assets::enqueue_app_assets( 'admin' );

		wp_localize_script(
			'admin',
			'ea11ySettingsData',
			[ 'wpRestNonce' => wp_create_nonce( 'wp_rest' ) ]
		);
	}

	public static function routes_list() : array {
		return [
			'Get_Settings',
		];
	}

	/**
	 * Get all plugin settings data
	 * @return array
	 */
	public static function get_plugin_settings(): array {

		return [
			'isConnected' => Connect::is_connected(),
		];
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_routes();
		$this->register_components();
		add_action( 'admin_menu', [ $this, 'register_page' ] );
		add_action( 'in_admin_header', [ $this, 'render_top_bar' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}
}
