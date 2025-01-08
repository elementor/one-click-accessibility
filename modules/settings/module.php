<?php

namespace EA11y\Modules\Settings;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Connect\Classes\Config;
use EA11y\Modules\Connect\Classes\Data;
use EA11y\Classes\Logger;
use EA11y\Modules\Settings\Classes\Settings;
use Throwable;
use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	const SETTING_PREFIX     = 'ea11y_';
	const SETTING_GROUP      = 'ea11y_settings';
	const SETTING_BASE_SLUG  = 'accessibility-settings-2'; //TODO: Change this later
	const SETTING_CAPABILITY = 'manage_options';

	public function get_name(): string {
		return 'settings';
	}

	public static function component_list(): array {
		return [
			'Settings_Pointer',
		];
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

	public function register_page() : void {
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
	public function enqueue_scripts( $hook ) : void {
		//TODO: Update page name
		if ( 'toplevel_page_accessibility-settings-2' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'ea11y-admin-fonts',
			'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
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
			'closePostConnectModal' => Settings::get( Settings::CLOSE_POST_CONNECT_MODAL ),
			'isRTL' => is_rtl(),
		];
	}

	/**
	 * @throws Exception
	 */
	public function on_connect(): void {
		if ( ! Connect::is_connected() ) {
			return;
		}

		$register_response = Utils::get_api_client()->make_request(
			'POST',
			'site/register'
		);

		if ( $register_response && ! is_wp_error( $register_response ) ) {
			Data::set_subscription_id( $register_response->id );
			update_option( Settings::PLAN_DATA, $register_response );
			update_option( Settings::IS_VALID_PLAN_DATA, true );
		} else {
			Logger::error( esc_html( $register_response->get_error_message() ) );
			update_option( Settings::IS_VALID_PLAN_DATA, false );
		}
	}

	/**
	 * Retry registering the site if it fails during connect.
	 *
	 * @param $current_screen
	 * @return void
	 */
	public function check_plan_data( $current_screen ) : void {
		//TODO: Update page name
		if ( 'toplevel_page_accessibility-settings-2' !== $current_screen->base ) {
			return;
		}

		if ( Connect::is_connected() && get_option( Settings::PLAN_DATA ) === false ) {
			$register_response = Utils::get_api_client()->make_request(
				'POST',
				'site/register'
			);

			if ( $register_response && ! is_wp_error( $register_response ) ) {
				Data::set_subscription_id( $register_response->id );
				update_option( Settings::PLAN_DATA, $register_response );
				update_option( Settings::IS_VALID_PLAN_DATA, true );
			} else {
				Logger::error( esc_html( $register_response->get_error_message() ) );
				update_option( Settings::IS_VALID_PLAN_DATA, false );
			}
		}
	}

	/**
	 * Register settings.
	 *
	 * Register settings for the plugin.
	 *
	 * @return void
	 * @throws Throwable
	 */
	public function register_settings(): void {
		$settings = [
			'widget_menu_settings' => [
				'type' => 'object',
				'show_in_rest' => [
					'schema' => [
						'type' => 'object',
						'additionalProperties' => true,
					],
				],
			],
			'widget_icon_settings' => [
				'type' => 'object',
				'show_in_rest' => [
					'schema' => [
						'type' => 'object',
						'additionalProperties' => true,
					],
				],
			],
			'plan_data' => [
				'type' => 'object',
				'show_in_rest' => [
					'schema' => [
						'type' => 'object',
						'additionalProperties' => true,
					],
				],
			],
			'accessibility_statement_data' => [
				'type' => 'object',
				'show_in_rest' => [
					'schema' => [
						'type' => 'object',
						'additionalProperties' => true,
					],
				],
			],
			'close_post_connect_modal' => [
				'type' => 'boolean',
			],
			'hide_minimum_active_options_alert' => [
				'type' => 'boolean',
			],
		];

		foreach ( $settings as $setting => $args ) {
			if ( ! isset( $args['show_in_rest'] ) ) {
				$args['show_in_rest'] = true;
			}
			register_setting( 'options', self::SETTING_PREFIX . $setting, $args );
		}
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_routes();
		$this->register_components( self::component_list() );
		add_action( 'admin_menu', [ $this, 'register_page' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'rest_api_init', [ $this, 'register_settings' ] );
		add_action( 'on_connect_' . Config::APP_PREFIX . '_connected', [ $this, 'on_connect' ] );
		add_action( 'current_screen', [ $this, 'check_plan_data' ] );
	}
}
