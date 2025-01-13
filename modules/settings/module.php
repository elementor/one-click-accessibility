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
	const SETTING_BASE_SLUG  = 'accessibility-settings'; //TODO: Change this later
	const SETTING_CAPABILITY = 'manage_options';
	const SETTING_PAGE_SLUG = 'toplevel_page_' . self::SETTING_BASE_SLUG;

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
			__( 'Equally', 'pojo-accessibility' ), //TODO: Change this later
			__( 'Equally', 'pojo-accessibility' ),
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
		if ( self::SETTING_PAGE_SLUG !== $hook ) {
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

		$this->save_plan_data( $register_response );
	}

	/**
	 * Save plan data to plan_data option
	 * @param $register_response
	 *
	 * @return void
	 */
	public function save_plan_data( $register_response ) : void {
		if ( $register_response && ! is_wp_error( $register_response ) ) {
			$decoded_response = json_decode( $register_response );
			Data::set_subscription_id( $decoded_response->id );
			update_option( Settings::PLAN_DATA, $decoded_response );
			update_option( Settings::IS_VALID_PLAN_DATA, true );
			$this->set_default_settings();
		} else {
			Logger::error( esc_html( $register_response->get_error_message() ) );
			update_option( Settings::IS_VALID_PLAN_DATA, false );
		}
	}

	/**
	 * Set default values after successful registration.
	 * @return void
	 */
	private function set_default_settings() : void {
		$widget_menu_settings = [
			'bigger-text' => [
				'enabled' => true,
			],
			'bigger-line-height' => [
				'enabled' => true,
			],
			'text-align' => [
				'enabled' => true,
			],
			'readable-font' => [
				'enabled' => true,
			],
			'grayscale' => [
				'enabled' => true,
			],
			'contrast' => [
				'enabled' => true,
			],
			'page-structure' => [
				'enabled' => true,
			],
			'reading-mask' => [
				'enabled' => true,
			],
			'hide-images' => [
				'enabled' => true,
			],
			'pause-animations' => [
				'enabled' => true,
			],
			'highlight-links' => [
				'enabled' => true,
			],
		];

		$widget_icon_settings = [
			'desktop' => [
				'hidden' => false,
				'enableExactPosition' => false,
				'exactPosition' => [
					'horizontal' => [
						'direction' => 'to-left',
						'value' => 10,
						'unit' => 'px',
					],
					'vertical' => [
						'direction' => 'higher',
						'value' => 10,
						'unit' => 'px',
					],
				],
				'position' => 'top-left',
			],
			'mobile' => [
				'hidden' => false,
				'enableExactPosition' => false,
				'exactPosition' => [
					'horizontal' => [
						'direction' => 'to-right',
						'value' => 10,
						'unit' => 'px',
					],
					'vertical' => [
						'direction' => 'lower',
						'value' => 10,
						'unit' => 'px',
					],
				],
				'position' => 'top-left',
			],
		];

		if ( ! get_option( Settings::WIDGET_MENU_SETTINGS ) ) {
			update_option( Settings::WIDGET_MENU_SETTINGS, $widget_menu_settings );
		}

		if ( ! get_option( Settings::WIDGET_ICON_SETTINGS ) ) {
			update_option( Settings::WIDGET_ICON_SETTINGS, $widget_icon_settings );
		}
	}

	/**
	 * Retry registering the site if it fails during connect.
	 *
	 * @param $current_screen
	 * @return void
	 */
	public function check_plan_data( $current_screen ) : void {
		if ( self::SETTING_PAGE_SLUG !== $current_screen->base ) {
			return;
		}

		if ( Connect::is_connected() && get_option( Settings::PLAN_DATA ) === false ) {
			$register_response = Utils::get_api_client()->make_request(
				'POST',
				'site/register'
			);

			$this->save_plan_data( $register_response );
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
			'show_accessibility_generated_page_infotip' => [
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
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 9 );
		add_action( 'rest_api_init', [ $this, 'register_settings' ] );
		add_action( 'on_connect_' . Config::APP_PREFIX . '_connected', [ $this, 'on_connect' ] );
		add_action( 'current_screen', [ $this, 'check_plan_data' ] );
	}
}
