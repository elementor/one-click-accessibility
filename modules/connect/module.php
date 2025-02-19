<?php

namespace EA11y\Modules\Connect;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Connect\Classes\Data;
use EA11y\Modules\Connect\Classes\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Module
 */
class Module extends Module_Base {

	/**
	 * Get module name.
	 * Retrieve the module name.
	 * @access public
	 * @return string Module name.
	 */
	public function get_name() {
		return 'connect';
	}

	/**
	 * component_list
	 * @return string[]
	 */
	public static function component_list() : array {
		return [
			'Handler',
		];
	}

	/**
	 * routes_list
	 * @return string[]
	 */
	public static function routes_list() : array {
		return [
			'Authorize',
			'Disconnect',
			'Deactivate',
			'Deactivate_And_Disconnect',
			'Switch_Domain',
			'Reconnect',
		];
	}

	public static function is_connected() : bool {
		return ! ! Data::get_access_token() && Utils::is_valid_home_url();
	}

	public function authorize_url( $authorize_url ) {
		$utm_params = [];

		$a11y_campaign = get_transient( 'elementor_ea11y_campaign' );
		if ( false === $a11y_campaign ) {
			return $authorize_url;
		}

		foreach ( [ 'source', 'medium', 'campaign' ] as $key ) {
			if ( ! empty( $a11y_campaign[ $key ] ) ) {
				$utm_params[ 'utm_' . $key ] = $a11y_campaign[ $key ];
			}
		}

		if ( ! empty( $utm_params ) ) {
			$authorize_url = add_query_arg( $utm_params, $authorize_url );
		}

		return $authorize_url;
	}

	public function __construct() {
		$this->register_components();
		$this->register_routes();
		add_filter( 'ea11y_connect_authorize_url', [ $this, 'authorize_url' ] );
	}
}

