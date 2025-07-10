<?php

namespace EA11y\Modules\Remediation\Exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Missing_URL
 */
class Missing_URL extends \Exception {
	protected $message = 'Missing URL';
}
