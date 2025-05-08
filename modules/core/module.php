<?php
namespace EA11y\Modules\Core;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Settings\Module as Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	public function get_name(): string {
		return 'core';
	}

	public static function component_list() : array {
		return [
			'Pointers',
			'Notices',
			'Skip_Link',
			'Revert_To_Legacy',
			'Svg',
		];
	}

	public function add_plugin_links( $links, $plugin_file_name ) : array {
		if ( ! str_ends_with( $plugin_file_name, '/pojo-accessibility.php' ) ) {
			return (array) $links;
		}

		$custom_links = [
			'settings' => sprintf(
				'<a href="%s">%s</a>',
				admin_url( 'admin.php?page=' . Settings::SETTING_BASE_SLUG ),
				esc_html__( 'Settings', 'pojo-accessibility' )
			),
		];

		if ( ! Connect::is_connected() ) {
			$custom_links['connect'] = sprintf(
				'<a href="%s" style="color: #524CFF; font-weight: 700;">%s</a>',
				admin_url( 'admin.php?page=' . Settings::SETTING_BASE_SLUG ),
				esc_html__( 'Connect', 'pojo-accessibility' )
			);
		}

		return array_merge( $custom_links, $links );
	}

	public static function is_active() : bool {
		return true;
	}

	public function enqueue_scripts() : void {
		wp_enqueue_style(
			'ea11y-global-style',
			EA11Y_ASSETS_URL . 'css/admin.css',
			[],
			EA11Y_VERSION
		);
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_components();
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_filter( 'plugin_action_links', [ $this, 'add_plugin_links' ], 10, 2 );
	}
}
