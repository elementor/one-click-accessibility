<?php

namespace EA11y\Classes\Database\Exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Missing_Table_Exception
 *
 * represent the exception thrown when the Entry's get_helper_class() function is not properly overridden
 * to return the Table-derivative class which represents the Entry's database representation.
 */
class Missing_Table_Exception extends \Exception {
	protected $message = 'You must provide a PlatformCommon\Database\Table in extending class';
	protected $code = 'missing_table';
}
