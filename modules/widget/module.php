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
	public function enqueue_accessibility_widget () : void {

		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = json_decode(Settings::get( Settings::PLAN_DATA ));

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		wp_enqueue_script(
			'ea11y-widget',
			$this->get_widget_url() .'?api_key=' . $plan_data->public_api_key,
			[],
			EA11Y_VERSION,
			true
		);

		wp_localize_script(
			'ea11y-widget',
			'ea11yWidget',
			[
				'iconSettings' => get_option( 'ea11y_widget_icon_settings' ),
				'toolsSettings' => get_option( 'ea11y_widget_menu_settings' ),
			]
		);
	}

	private function get_widget_url() : string {
		return apply_filters( 'ea11y_widget_url', '' ); // TODO: add public url
	}

	/**
	 * Load empty scripts in admin
	 * @return void
	 */
	public function enqueue_accessibility_widget_admin () : void {
		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = json_decode(Settings::get( Settings::PLAN_DATA ));

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		wp_enqueue_script(
			'ea11y-widget',
			EA11Y_ASSETS_URL . '/js/widget.js',
			[],
			EA11Y_VERSION,
			true
		);

		wp_localize_script(
			'ea11y-widget',
			'ea11yWidget',
			[
				'iconSettings' => get_option( 'ea11y_widget_icon_settings' ),
				'toolsSettings' => get_option( 'ea11y_widget_menu_settings' ),
				'preview' => true,
				'previewContainer' => '#ea11y-widget-preview--container'
			]
		);
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_accessibility_widget' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_accessibility_widget_admin' ] );
	}
}
