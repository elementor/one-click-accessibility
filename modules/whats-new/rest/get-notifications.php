<?php

namespace EA11y\Modules\WhatsNew\Rest;

use EA11y\Modules\WhatsNew\{
	Components\Notificator,
	Classes\Route_Base,
	Module,
};

use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Get_Notifications extends Route_Base {
	protected string $path = '';

	public function get_name(): string {
		return 'get-notifications';
	}

	public function get_methods(): array {
		return [ 'GET' ];
	}

	public function GET() {
		try {
			$n = new Notificator();

			$notifications = $n->get_notifications_by_conditions( true );
			Module::set_data_hash( $notifications );

			return $this->respond_success_json( $notifications );
		} catch ( Throwable $t ) {
			return $this->respond_error_json([
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			]);
		}
	}
}
