<?php

namespace EA11y\Modules\Connect\Classes\Exceptions;

use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Service_Exception extends Exception {
	protected $message = 'Service Exception';
}
