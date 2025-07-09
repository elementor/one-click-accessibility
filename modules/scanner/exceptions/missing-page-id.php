<?php

namespace EA11y\Modules\Scanner\exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Missing_Page_Id
 */
class Missing_Page_Id extends \Exception {
	protected $message = 'Missing Page ID';
}
