<?php
namespace EA11y\Modules\Settings;

use EA11y\Classes\{
	Logger,
	Module_Base,
	Utils
};
use EA11y\Modules\Connect\Classes\{
	Config,
	Data,
	Exceptions\Service_Exception
};
use EA11y\Modules\Connect\Classes\Utils as Connect_Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Core\Components\{
	Notices,
	Svg
};
use EA11y\Modules\Settings\Banners\Elementor_Birthday_Banner;
use EA11y\Modules\Settings\Banners\Onboarding_Banner;
use EA11y\Modules\Settings\Banners\BF_Sale_2025_Banner;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Widget\Module as WidgetModule;
use EA11y\Modules\WhatsNew\Module as WhatsNewModule;
use Exception;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	const SETTING_PREFIX     = 'ea11y_';
	const SETTING_GROUP      = 'ea11y_settings';
	const SETTING_BASE_SLUG  = 'accessibility-settings';
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
		<?php Elementor_Birthday_Banner::get_banner( 'https://go.elementor.com/acc-b-day-banner' ); ?>
		<?php BF_Sale_2025_Banner::get_banner('https://go.elementor.com/acc-BF-sale'); ?>

		<!-- The hack required to wrap WP notifications -->
		<div class="wrap">
			<h1 style="display: none;" role="presentation"></h1>
		</div>

		<div id="ea11y-app"></div>
		<?php
	}

	public function admin_banners() {
		Onboarding_Banner::get_banner();
	}

	public function register_page() : void {
		add_menu_page(
			__( 'Ally - Web Accessibility', 'pojo-accessibility' ),
			__( 'Ally', 'pojo-accessibility' ),
			self::SETTING_CAPABILITY,
			self::SETTING_BASE_SLUG,
			[ $this, 'render_app' ],
			$this->get_menu_icon(),
		);
	}

	private function get_menu_icon() : string {
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383 383">
										<path fill="#a7aaad" d="M191.47,0C85.73,0,0,85.73,0,191.47s85.73,191.47,191.47,191.47,191.47-85.73,191.47-191.47S297.22,0,191.47,0ZM191.47,64.82c15.33,0,27.75,12.42,27.75,27.75s-12.42,27.75-27.75,27.75-27.75-12.42-27.75-27.75,12.42-27.75,27.75-27.75ZM296.71,150.59l-51.42,9.25c-9.25.3-16.6,7.89-16.6,17.14l5.14,126.4c0,8.16-6.6,14.76-14.76,14.76-7.72,0-14.12-5.96-14.72-13.65l-4.65-61.58c-.3-3.88-3.54-6.88-7.42-6.88s-7.12,2.99-7.42,6.88l-4.65,61.58c-.57,7.69-7,13.65-14.71,13.65-8.16,0-14.77-6.6-14.77-14.76l5.52-137.01,40.04-2.92-63.61-6.75-46.45-6.13c-10.16-1.16-15.66-7-15.66-16.12s7.57-16.42,16.67-16.12l61.85,9.72c28.07,2.77,55.77,2.84,83.1,0l63.51-9.74v.02c9.1-.3,16.64,7.02,16.64,16.15s-5.42,14.32-15.65,16.12Z"/>
								</svg>';

		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}

	/**
	 * Enqueue Scripts and Styles
	 */
	public function enqueue_scripts( $hook ) : void {
		if ( self::SETTING_PAGE_SLUG !== $hook ) {
			return;
		}

		wp_enqueue_media();

		if ( version_compare( get_bloginfo( 'version' ), '6.6', '<' ) ) {
			wp_register_script(
				'react-jsx-runtime',
				EA11Y_ASSETS_URL . 'lib/react-jsx-runtime.js',
				[ 'react' ],
				'18.3.0',
				true
			);
		}

		self::refresh_plan_data();

		wp_enqueue_style(
			'ea11y-admin-fonts',
			'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
			[],
			EA11Y_VERSION
		);

		Utils\Assets::enqueue_app_assets( 'admin', true, [ 'wp-util', 'wp-block-editor', 'wp-components' ] );

		wp_localize_script(
			'admin',
			'ea11ySettingsData',
			[
				'wpRestNonce' => wp_create_nonce( 'wp_rest' ),
				'planData' => Settings::get( Settings::PLAN_DATA ),
				'planScope' => Settings::get( Settings::PLAN_SCOPE ),
				'pluginEnv' => self::get_plugin_env(),
				'pluginVersion' => EA11Y_VERSION,
				'widgetUrl' => WidgetModule::get_widget_url(),
				'adminUrl' => admin_url(),
				'isUrlMismatch' => ! Connect_Utils::is_valid_home_url(),
				'isDevelopment' => defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG,

				'homeUrl' => home_url(),
			]
		);
	}

	/**
	 * Get Mixpanel project Token
	 * @return string
	 */
	public static function get_plugin_env() : string {
		return apply_filters( 'ea11y_plugin_env', 'production' );
	}

	public static function routes_list() : array {
		return [
			'Get_Settings',
			'Get_Media',
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
			'closeOnboardingModal' => Settings::get( Settings::CLOSE_ONBOARDING_MODAL ),
			'isRTL' => is_rtl(),
			'isUrlMismatch' => ! Connect_Utils::is_valid_home_url(),
			'unfilteredUploads' => Svg::are_unfiltered_uploads_enabled(),
			'homeUrl' => home_url(),
			'whatsNewDataHash' => WhatsNewModule::compare_data_hash(),
		];
	}

	/**
	 * @throws Exception
	 */
	public function on_connect(): void {
		if ( ! Connect::is_connected() ) {
			return;
		}

		self::register_site_with_data();
	}

	/**
	 * Register the website and save the plan data.
	 * @return void
	 */
	public static function register_site_with_data() : void {
		$register_response = Utils::get_api_client()->make_request(
			'POST',
			'site/register'
		);

		if ( is_wp_error( $register_response ) ) {
			Logger::error( esc_html( $register_response->get_error_message() ) );
		} else {
			self::save_plan_data( $register_response );
			if ( isset( $register_response->scopes ) ) {
				Settings::set( Settings::PLAN_SCOPE, $register_response->scopes );
			}
		}
	}

	/**
	 * Save plan data to plan_data option
	 * @param $register_response
	 *
	 * @return void
	 */
	public static function save_plan_data( $register_response ) : void {
		if ( $register_response && ! is_wp_error( $register_response ) ) {
			$decoded_response = $register_response;
			Data::set_subscription_id( $decoded_response->plan->subscription_id );
			update_option( Settings::PLAN_DATA, $decoded_response );
			update_option( Settings::IS_VALID_PLAN_DATA, true );
			self::set_default_settings();
			self::set_plan_data_refresh_transient();
		} else {
			Logger::error( esc_html( $register_response->get_error_message() ) );
			update_option( Settings::IS_VALID_PLAN_DATA, false );
		}
	}

	/**
	 * Refresh the plan data after 12 hours
	 * @return void
	 */
	public static function refresh_plan_data() : void {
		if ( ! Connect::is_connected() ) {
				return;
		}

		// Refresh only if refresh transient is expired
		if ( self::get_plan_data_refresh_transient() ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		// Return if plan data does not have public_api_key
		if ( ! $plan_data->public_api_key ) {
			Logger::error( 'Cannot refresh the plan data. No public API key found.' );
			self::register_site_with_data();
			return;
		}

		try {
			$response = Utils::get_api_client()->make_request(
				'GET',
				'site/info',
				[ 'api_key' => $plan_data->public_api_key ]
			);

			if ( ! is_wp_error( $response ) ) {
				Settings::set( Settings::PLAN_DATA, $response );
				Settings::set( Settings::IS_VALID_PLAN_DATA, true );
				self::set_plan_data_refresh_transient();
			} else {
				Logger::error( esc_html( $response->get_error_message() ) );
				Settings::set( Settings::IS_VALID_PLAN_DATA, false );
			}
		} catch ( Service_Exception $se ) {
			Logger::error( esc_html( $se->getMessage() ) );
			Settings::set( Settings::IS_VALID_PLAN_DATA, false );
		}
	}

	/**
	 * Get default settings for the plugin.
	 */
	public static function get_default_settings( $setting ): array {
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
			'sitemap' => [
				'enabled' => false,
				'url' => home_url( '/wp-sitemap.xml' ),
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
			'focus-outline' => [
				'enabled' => true,
			],
		];

		$widget_icon_settings = [
			'style' => [
				'icon' => 'person',
				'size' => 'medium',
				'color' => '#2563eb',
			],
			'position' => [
				'desktop' => [
					'hidden' => false,
					'enableExactPosition' => false,
					'exactPosition' => [
						'horizontal' => [
							'direction' => 'right',
							'value' => 10,
							'unit' => 'px',
						],
						'vertical' => [
							'direction' => 'bottom',
							'value' => 10,
							'unit' => 'px',
						],
					],
					'position' => is_rtl() ? 'bottom-left' : 'bottom-right',
				],
				'mobile' => [
					'hidden' => false,
					'enableExactPosition' => false,
					'exactPosition' => [
						'horizontal' => [
							'direction' => 'right',
							'value' => 10,
							'unit' => 'px',
						],
						'vertical' => [
							'direction' => 'bottom',
							'value' => 10,
							'unit' => 'px',
						],
					],
					'position' => is_rtl() ? 'bottom-left' : 'bottom-right',
				],
			],
		];

		$skip_to_content_setting = [
			'enabled' => true,
			'anchor' => '#content',
		];

		switch ( $setting ) {
			case 'widget_menu_settings':
				return $widget_menu_settings;
			case 'widget_icon_settings':
				return $widget_icon_settings;
			case 'skip_to_content_settings':
				return $skip_to_content_setting;
			default:
				return [];
		}
	}

	/**
	 * Set default values after successful registration.
	 * @return void
	 */
	private static function set_default_settings() : void {

		if ( ! get_option( Settings::WIDGET_MENU_SETTINGS ) ) {
			update_option( Settings::WIDGET_MENU_SETTINGS, self::get_default_settings( 'widget_menu_settings' ) );
		}

		if ( ! get_option( Settings::WIDGET_ICON_SETTINGS ) ) {
			update_option( Settings::WIDGET_ICON_SETTINGS, self::get_default_settings( 'widget_icon_settings' ) );
		}

		if ( ! get_option( Settings::SKIP_TO_CONTENT ) ) {
			update_option( Settings::SKIP_TO_CONTENT, self::get_default_settings( 'skip_to_content_settings' ) );
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

			self::save_plan_data( $register_response );
			self::set_plan_data_refresh_transient();
		}
	}

	public function remove_admin_footer_text( $text ) {
		$screen = get_current_screen();

		if ( self::SETTING_PAGE_SLUG === $screen->base ) {
			remove_filter( 'update_footer', 'core_update_footer' );
			return '';
		}

		return $text;
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
			'skip_to_content_settings' => [
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
			'analytics_enabled' => [
				'type' => 'boolean',
			],
			'show_accessibility_generated_page_infotip' => [
				'type' => 'boolean',
			],
			'unfiltered_files_upload' => [
				'type' => 'boolean',
			],
			'close_onboarding_modal' => [
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

	public static function set_plan_data_refresh_transient(): void {
		set_transient( Settings::PLAN_DATA_REFRESH_TRANSIENT, true, MINUTE_IN_SECONDS * 15 );
	}

	public static function get_plan_data_refresh_transient(): bool {
		return get_transient( Settings::PLAN_DATA_REFRESH_TRANSIENT );
	}

	public static function delete_plan_data_refresh_transient(): bool {
		return delete_transient( Settings::PLAN_DATA_REFRESH_TRANSIENT );
	}

	/**
	 * get_upgrade_link
	 *
	 * @param $campaign
	 *
	 * @return string
	 */
	public static function get_upgrade_link( $campaign ) : string {
		return add_query_arg([
			'utm_source' => $campaign . '-upgrade',
			'utm_medium' => 'wp-dash',
		], 'https://go.elementor.com/' . $campaign );
	}

	/**
	 * register_notices
	 *
	 * @param Notices $notice_manager
	 */
	public function register_notices( Notices $notice_manager ) {
		$notices = [
			'Quota_80',
			'Quota_100',
		];

		foreach ( $notices as $notice ) {
			$class_name = 'EA11y\Modules\Settings\Notices\\' . $notice;
			$notice_manager->register_notice( new $class_name() );
		}
	}

	/**
	 * @return float
	 */
	public static function get_plan_usage() : float {
		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! $plan_data ) {
			return 0;
		}

		if ( ! isset( $plan_data->visits ) ) {
			return 0;
		}

		return round( $plan_data->visits->used / $plan_data->visits->allowed * 100, 2 );
	}

	/**
	 * @param $url
	 * @return string|\WP_Error
	 */
	public static function get_media( $url ) {
		return wp_remote_get( $url );
	}

	/**
	 * Hide all admin notices on the settings page
	 */
	public function hide_admin_notices() {
		$current_screen = get_current_screen();
		if ( $current_screen && $current_screen->id === self::SETTING_PAGE_SLUG ) {
			remove_all_actions( 'admin_notices' );
			remove_all_actions( 'all_admin_notices' );
		}
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_routes();
		$this->register_components( self::component_list() );

		add_filter( 'admin_footer_text', [ $this, 'remove_admin_footer_text' ] );
		add_action( 'admin_menu', [ $this, 'register_page' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 9 );
		add_action( 'rest_api_init', [ $this, 'register_settings' ] );
		add_action( 'on_connect_' . Config::APP_PREFIX . '_connected', [ $this, 'on_connect' ] );
		add_action( 'current_screen', [ $this, 'check_plan_data' ] );
		add_action( 'admin_head', [ $this, 'hide_admin_notices' ] );
		
		// Register notices
		//add_action( 'ea11y_register_notices', [ $this, 'register_notices' ] );
		add_action( 'admin_notices', [ $this, 'admin_banners' ] );
	}
}
