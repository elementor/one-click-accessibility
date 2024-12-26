<?php

namespace EA11y\Modules\Widget;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Classes\Logger;
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

		$plan_data = Settings::get( Settings::PLAN_DATA );

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
				'menuSettings' => get_option( 'ea11y_widget_menu_settings' ),
			]
		);
	}

	private function get_widget_url() : string {
		return apply_filters( 'ea11y_widget_url', '' ); // TODO: add public url
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_accessibility_widget' ] );
	}
}
