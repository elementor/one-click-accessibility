<?php

namespace EA11y\Modules\Reviews\Classes;

use Exception;
use EA11y\Classes\Services\Client;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Feedback_Handler
 *
 * Class to post feedback
 */
class Feedback_Handler {

	const SERVICE_ENDPOINT = 'feedback/reviews';

	/**
	 * Send request to the service to submit the feedback.
	 *
	 * @param $params
	 *
	 * @return string
	 * @throws Exception
	 */
	public static function post_feedback( $params ) {
		$response = Client::get_instance()->make_request(
			'POST',
			self::SERVICE_ENDPOINT,
			$params
		);

		if ( empty( $response ) || is_wp_error( $response ) ) {
			throw new Exception( 'Failed to add the feedback.' );
		}

		return $response;
	}
}
