<?php

namespace EA11y\Modules\WhatsNew;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\WhatsNew\Components\Notificator;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {
	public function get_name(): string {
		return 'whats-new';
	}

	public static function component_list(): array {
		return [
			'Notificator',
		];
	}
	
	public static function routes_list() : array {
		return [
			'Get_Notifications',
		];
	}

	public static function generate_data_hash( $data ) : string {
		return md5( json_encode( $data ) );
	}

	public static function set_data_hash( $data ) : void {
		Settings::set( Settings::DATA_HASH_OPTION, self::generate_data_hash( $data ) );
	}

	public static function get_data_hash(): string {
		return Settings::get( Settings::DATA_HASH_OPTION );
	}

	public static function compare_data_hash(): bool {
		$n = new Notificator();
		$new_hash = md5(json_encode($n->get_notifications_by_conditions( true )));

		return $new_hash !== self::get_data_hash();
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_routes();
		$this->register_components();
	}
}
