<?php

namespace EA11y\Modules\WhatsNew;

use EA11y\Classes\Module_Base;
use EA11y\Modules\WhatsNew\Components\Notificator;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	private const DATA_HASH_OPTION = 'ea11y_data_hash';

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
		$user_id = get_current_user_id();
		if ( $user_id ) {
			update_user_meta( $user_id, self::DATA_HASH_OPTION, self::generate_data_hash( $data ) );
		}
	}

	public static function get_data_hash(): string {
		$user_id = get_current_user_id();
		if ( $user_id ) {
			return get_user_meta( $user_id, self::DATA_HASH_OPTION, true ) ?: '';
		}
		return '';
	}

	public static function compare_data_hash(): bool {
		$current_hash = self::get_data_hash();

		if ( ! $current_hash || empty( $current_hash ) ) {
			return true;
		}

		$latest_hash = md5(json_encode(self::get_notifications()));

		return $current_hash !== $latest_hash;
	}

	public static function get_notifications() {

		$notifications = get_transient( 'ea11y_whats_new_notification' );

		if ( ! $notifications ) {

			$n = new Notificator();
			$notifications = $n->get_notifications_by_conditions( true );

			set_transient( 'ea11y_whats_new_notification', $notifications, 60 * 60 * 12 );
		}

		return $notifications;
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_routes();
		$this->register_components();
	}
}
