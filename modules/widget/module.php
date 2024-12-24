<?php

namespace EA11y\Modules\Widget;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Classes\Logger;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Classes\Services\Client;
use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'widget';
	}

	/**
	 * @return void
	 * @throws Exception
	 */
	public function get_widget() : void {
		if ( ! Connect::is_connected()  ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! is_wp_error( $plan_data ) && ! empty( $plan_data ) && ! empty( $plan_data->public_api_key ) ) {

			$widget_code = Utils::get_api_client()->make_request(
				'GET',
				'product/widget?api_key=' . $plan_data->public_api_key
			);

			if ( ! is_wp_error( $widget_code ) && ! empty( $widget_code ) ) {
				wp_add_inline_script( 'ea11y-widget', $widget_code );
			} else {
				$this->show_widget_load_error();
				Logger::error( esc_html( $widget_code->get_error_message() ) );
			}

		} else {
			$this->show_widget_load_error();
			Logger::error( esc_html( $plan_data->get_error_message() ) );
		}
	}

	/**
	 * Show a console error when widget fails to load
	 * @return void
	 */
	private function show_widget_load_error () : void {
		wp_add_inline_script('ea11y-widget', "console.error('Failed to load accessibility widget');");
	}

	/**
	 * Enqueue scripts
	 *
	 * @return void
	 * @throws Exception
	 */
	public function enqueue_global_assets () : void {

		wp_enqueue_script(
			'ea11y-widget',
			EA11Y_ASSETS_URL . '/js/widget.js',
			[],
			EA11Y_VERSION,
			true
		);

		// fetch widget from service
		$this->get_widget();

		wp_localize_script(
			'ea11y-widget',
			'ea11yWidgetData',
			[
				'iconSettings' => wp_json_encode( get_option( 'ea11y_widget_icon_settings' ) ),
				'menuSettings' => wp_json_encode( get_option( 'ea11y_widget_menu_settings' ) ),
				'wpRestNonce' => wp_create_nonce( 'wp_rest' )
			]
		);
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_global_assets' ] );
	}
}
