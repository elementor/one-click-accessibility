<?php

namespace EA11y\Tests\Modules\Settings;

use EA11y\Modules\Settings\Module as SettingsModule;
use EA11y\Tests\Helpers\Module_Test_Base;

/**
 * Class Module
 */
class Module extends Module_Test_Base {
	public $name = 'settings';

	public $components = [
		'Settings_Pointer',
	];

	public $routes = [
		'Get_Settings',
		'Get_Media',
	];

	public function test_register_page_adds_ally_as_top_level_menu() {
		$this->module->register_page();

		$ally_menu_item = $this->find_menu_item_by_slug( SettingsModule::SETTING_BASE_SLUG );

		$this->assertNotNull( $ally_menu_item, 'Ally top-level menu item was not registered.' );
		$this->assertSame( 'Ally', $ally_menu_item[0] );
	}

	public function test_register_page_does_not_add_any_submenu_items() {
		global $submenu;

		$this->module->register_page();

		$this->assertTrue(
			empty( $submenu[ SettingsModule::SETTING_BASE_SLUG ] ),
			'Ally menu should not have any submenu items.'
		);
	}

	public function test_get_menu_icon_returns_a_base64_svg_data_uri() {
		$icon = SettingsModule::get_menu_icon();

		$this->assertStringStartsWith( 'data:image/svg+xml;base64,', $icon );

		$encoded = substr( $icon, strlen( 'data:image/svg+xml;base64,' ) );
		$decoded = base64_decode( $encoded );

		$this->assertStringContainsString( '<svg', $decoded );
	}

	/**
	 * Find a top-level admin menu entry by its slug.
	 *
	 * @param string $slug Menu slug to search for.
	 * @return array|null
	 */
	private function find_menu_item_by_slug( string $slug ): ?array {
		global $menu;

		foreach ( $menu as $menu_item ) {
			if ( isset( $menu_item[2] ) && $slug === $menu_item[2] ) {
				return $menu_item;
			}
		}

		return null;
	}
}
