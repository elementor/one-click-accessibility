<?php

namespace EA11y\Modules\Connect\Rest;

use EA11y\Modules\Connect\Classes\{
	Data,
	Route_Base,
	Service,
	Utils
};

use EA11y\Modules\Connect\Module as Connect;
use Throwable;
use WP_REST_Request;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Settings\Module as SettingsBase;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Authorize
 */
class Authorize extends Route_Base {
	public string $path = 'authorize';
	public const NONCE_NAME = 'wp_rest';

	public function get_methods(): array {
		return [ 'POST' ];
	}

	public function get_name(): string {
		return 'authorize';
	}

	public function POST( WP_REST_Request $request ) {
		$valid = $this->verify_nonce_and_capability(
			$request->get_param( self::NONCE_NAME ),
			self::NONCE_NAME
		);

		if ( is_wp_error( $valid ) ) {
			return $this->respond_error_json( [
				'message' => $valid->get_error_message(),
				'code' => 'forbidden',
			] );
		}

		if ( Connect::is_connected() && Utils::is_valid_home_url() ) {
			return $this->respond_error_json( [
				'message' => esc_html__( 'You are already connected', 'pojo-accessibility' ),
				'code' => 'forbidden',
			] );
		}

		try {
			$client_id = Data::get_client_id();

			if ( ! $client_id ) {
				$client_id = Service::register_client();
			}

			if ( ! Utils::is_valid_home_url() ) {
				if ( $request->get_param( 'update_redirect_uri' ) ) {
					Service::update_redirect_uri();
					SettingsBase::delete_plan_data_refresh_transient();

					// Return a success message if the redirect URI was updated. No need to authorize again.
					return $this->respond_success_json( [ 'success' => true ] );
				} else {
					return $this->respond_error_json( [
						'message' => esc_html__( 'Connected domain mismatch', 'pojo-accessibility' ),
						'code'    => 'forbidden',
					] );
				}
			}

			$authorize_url = Utils::get_authorize_url( $client_id );

			$authorize_url = apply_filters( 'ea11y_connect_authorize_url', $authorize_url );

			SettingsBase::delete_plan_data_refresh_transient();

			return $this->respond_success_json( $authorize_url );
		} catch ( Throwable $t ) {
			return $this->respond_error_json( [
				'message' => $t->getMessage(),
				'code' => 'internal_server_error',
			] );
		}
	}
}
