<?php

namespace EA11y\Modules\Widget;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Settings\Module as SettingsModule;
use EA11y\Modules\Settings\Classes\Settings;
use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'widget';
	}

	/**
	 * Enqueue scripts
	 *
	 * @return void
	 * @throws Exception
	 */
	public function enqueue_accessibility_widget() : void {
		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		wp_enqueue_script(
			'ea11y-widget',
			self::get_widget_url() . '?api_key=' . $plan_data->public_api_key,
			[],
			EA11Y_VERSION,
			true
		);

		wp_localize_script(
			'ea11y-widget',
			'ea11yWidget',
			[
				'iconSettings' => get_option( Settings::WIDGET_ICON_SETTINGS ),
				'toolsSettings' => get_option( Settings::WIDGET_MENU_SETTINGS ),
				'accessibilityStatementURL' => $this->get_accessibility_statement_url(),
			]
		);
	}

	/**
	 * Get widget URL
	 * @return string
	 */
	public static function get_widget_url() : string {
		return apply_filters( 'ea11y_widget_url', 'https://cdn.elementor.com/a11y/widget.js' );
	}

	/**
	 * Get accessibility statement URL
	 * @return string
	 */
	public function get_accessibility_statement_url() : string {
		$option = get_option( 'ea11y_accessibility_statement_data' );

		if ( ! empty( $option ) && ! empty( $option['link'] ) && empty( $option['hideLink'] ) ) {
			return $option['link'];
		}

		return '';
	}

	/**
	 * Load scripts in admin
	 * @param $hook
	 *
	 * @return void
	 */
	public function enqueue_accessibility_widget_admin( $hook ) : void {
		if ( SettingsModule::SETTING_PAGE_SLUG !== $hook ) {
			return;
		}

		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		$widget_state = [
			'iconSettings' => $this->get_widget_icon_settings(),
			'toolsSettings' => get_option( 'ea11y_widget_menu_settings' ),
			'preview' => true,
			'previewContainer' => '#ea11y-widget-preview--container',
			'apiKey' => $plan_data->public_api_key,
			'accessibilityStatementURL' => $this->get_accessibility_statement_url(),
		];

		?>

	<script id="ea11y-state">
		window.ea11yWidget = <?php echo json_encode( $widget_state ); ?>;
	</script>

		<?php
	}

	/**
	 * Remove person object from the icon settings for frontend.
	 * @return array
	 */
	public function get_widget_icon_settings() : array {
		$option = get_option( 'ea11y_widget_icon_settings' );

		if ( ! $option ) {
			return [];
		}

		unset( $option['style']['icon'] );

		return $option;
	}

	public static function component_list(): array {
		return [
			'Cache_Compatibility',
		];
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_components();
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_accessibility_widget' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_accessibility_widget_admin' ] );
	}
}
