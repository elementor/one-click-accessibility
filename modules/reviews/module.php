<?php

namespace EA11y\Modules\Reviews;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Settings\Module as SettingsModule;
use EA11y\Modules\Connect\Module as Connect;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Module
 */
class Module extends Module_Base {

	const REVIEW_DATA_OPTION = SettingsModule::SETTING_PREFIX . 'review_data';

	/**
	 * Get module name.
	 * Retrieve the module name.
	 *
	 * @access public
	 * @return string Module name.
	 */
	public function get_name(): string {
		return 'Reviews';
	}

	public static function routes_list() : array {
		return [
			'Feedback',
		];
	}

	public function render_app(): void {
		echo '<div id="reviews-app"></div>';
	}

	/**
	 * Enqueue Scripts and Styles
	 */
	public function enqueue_scripts( $hook ): void {
		if ( SettingsModule::SETTING_PAGE_SLUG !== $hook ) {
			return;
		}

		if ( ! Connect::is_connected() ) {
			return;
		}

		if ( ! $this->maybe_show_review_popup() ) {
			return;
		}

		Utils\Assets::enqueue_app_assets( 'reviews' );

		wp_localize_script(
			'reviews',
			'ea11yReviewData',
			[
				'wpRestNonce' => wp_create_nonce( 'wp_rest' ),
				'reviewData' => $this->get_review_data(),
				'isRTL' => is_rtl(),
			]
		);

		$this->render_app();
	}

	public function register_base_data(): void {

		if ( get_option( self::REVIEW_DATA_OPTION ) ) {
			return;
		}

		$data = [
			'dismissals' => 0,
			'hide_for_days' => 0,
			'last_dismiss' => null,
			'rating' => null,
			'feedback' => null,
			'added_on' => gmdate( 'Y-m-d H:i:s' ),
			'submitted' => false,
			'repo_review_clicked' => false,
		];

		update_option( self::REVIEW_DATA_OPTION, $data, false );
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
			'review_data' => [
				'type' => 'object',
				'show_in_rest' => [
					'schema' => [
						'type' => 'object',
						'additionalProperties' => true,
					],
				],
			],
		];

		foreach ( $settings as $setting => $args ) {
			if ( ! isset( $args['show_in_rest'] ) ) {
				$args['show_in_rest'] = true;
			}
			register_setting( 'options', SettingsModule::SETTING_PREFIX . $setting, $args );
		}
	}

	public function get_review_data(): array {
		return get_option( self::REVIEW_DATA_OPTION );
	}

	/**
	 * Get the number of days since the plugin was installed.
	 *
	 * @return int The number of days since the plugin was installed.
	 */
	public function get_days_since_installed() {
		$registered_at = Settings::get( Settings::PLAN_DATA )->site->registered_at ?? null;
		if ( ! $registered_at ) {
			return 0;
		}
		$days = floor( ( time() - strtotime( $registered_at ) ) / DAY_IN_SECONDS );
		return max( 0, $days );
	}

	/**
	 * Check if the settings have been modified by comparing them with the default settings.
	 * @return bool
	 */
	public function check_if_settings_modified() {

		// Get the current settings.
		$current_widget_menu_settings = Settings::get( Settings::WIDGET_MENU_SETTINGS );
		$current_widget_icon_settings = Settings::get( Settings::WIDGET_ICON_SETTINGS );
		$current_skip_to_content_settings = Settings::get( Settings::SKIP_TO_CONTENT );

		if ( ! $current_widget_menu_settings || ! $current_widget_icon_settings || ! $current_skip_to_content_settings ) {
			return false;
		}

		// Get the default settings.
		$widget_menu_settings = SettingsModule::get_default_settings( 'widget_menu_settings' );
		$widget_icon_settings = SettingsModule::get_default_settings( 'widget_icon_settings' );
		$skip_to_content_settings = SettingsModule::get_default_settings( 'skip_to_content_settings' );

		// Check if the current settings match the default settings.
		if ( $current_widget_menu_settings !== $widget_menu_settings || $current_widget_icon_settings !== $widget_icon_settings || $current_skip_to_content_settings !== $skip_to_content_settings ) {
			return true;
		}

		return false;
	}

	/**
	 * Maybe show the review popup.
	 * Check if the review popup should be shown based on various conditions.
	 * @return bool
	 */
	public function maybe_show_review_popup() {
		if ( $this->check_if_settings_modified() && $this->get_days_since_installed() > 1 ) {

			$review_data = $this->get_review_data();

			// Don't show if user has already submitted feedback when rating is less than 4.
			if ( isset( $review_data['rating'] ) && (int) $review_data['rating'] < 4 ) {
				return false;
			}

			// Hide if rating is submitted but repo review is not clicked.
			if ( (int) $review_data['rating'] > 3 && $review_data['repo_review_clicked'] ) {
				return false;
			}

			// Don't show if user has dismissed the popup 3 times.
			if ( 3 === (int) $review_data['dismissals'] ) {
				return false;
			}

			if ( isset( $review_data['hide_for_days'] ) && $review_data['hide_for_days'] > 0 ) {
				$hide_for_days = $review_data['hide_for_days'];
				$last_dismiss = strtotime( $review_data['last_dismiss'] );
				$days_since_dismiss = floor( ( time() - $last_dismiss ) / DAY_IN_SECONDS );

				if ( $days_since_dismiss < $hide_for_days ) {
					return false;
				}
			}

			return true;
		}

		return false;
	}

	/**
	 * Add review link to plugin row meta
	 *
	 * @param array $links
	 * @param string $file
	 * @return array
	 * 
	 */
	public function add_plugin_row_meta( $links, $file ) {

		if ( ! defined( 'EA11Y_BASE' ) || EA11Y_BASE !== $file ) {
			return $links;
		}

		$links[] = '<a class="wp-ea11y-review" 
						href="https://wordpress.org/support/plugin/pojo-accessibility/reviews/#new-post"
						target="_blank" rel="noopener noreferrer" 
						title="' . esc_attr__( 'Review our plugin', 'pojo-accessibility' ) 
					. '">
							<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
					</a>';

		echo '<style>
				.wp-ea11y-review{ display: inline-flex;flex-direction: row-reverse;} 
				.wp-ea11y-review span{ color:#888}
				.wp-ea11y-review span:hover{color:#ffa400}
				.wp-ea11y-review span:hover~span{color:#ffa400}
			</style>';

		return $links;
	}

	public function __construct() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'admin_init', [ $this, 'register_base_data' ] );
		add_action( 'rest_api_init', [ $this, 'register_settings' ] );
		add_filter( 'plugin_row_meta', array( $this, 'add_plugin_row_meta' ), 10, 2 );

		$this->register_routes();
	}
}
