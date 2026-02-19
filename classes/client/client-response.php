<?php

namespace EA11y\Classes\Client;

use Exception;
use EA11y\Classes\Exceptions\Quota_Exceeded_Error;
use EA11y\Classes\Exceptions\Quota_API_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Client_Response {
	private array $known_errors;
	/**
	 * @var mixed
	 */
	private $response;

	/**
	 * @throws Quota_API_Error|Quota_Exceeded_Error|Exception
	 */
	public function handle() {
		if ( ! is_wp_error( $this->response ) ) {
			return $this->response;
		}

		$message = $this->response->get_error_message();

		if ( isset( $this->known_errors[ $message ] ) ) {
			throw $this->known_errors[ $message ];
		}

		throw new Exception( $message );
	}

	public function __construct( $response ) {
		$this->known_errors = [
			"Quota Status Guard Request Failed!: plan.features.ai_credits Quota exceeded" => new Quota_Exceeded_Error(),
			"Quota Api Request Failed!: Failed checking if allowed to use quota" => new Quota_API_Error(),
		];

		$this->response = $response;
	}
}
