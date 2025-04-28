<?php

namespace EA11y\Modules\WhatsNew\Components;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Elementor\WPNotificationsPackage\V110\Notifications as Notifications_SDK;

class Notificator {
	private ?Notifications_SDK $notificator = null;

	public function get_notifications_by_conditions( $force_request = false ) {
		return $this->notificator->get_notifications_by_conditions( $force_request );
	}

	public function __construct() {
		require_once EA11Y_PATH . '/vendor/autoload.php';

		$this->notificator = new Notifications_SDK(
			'ally',
			EA11Y_VERSION,
			'ally'
		);
	}
}
