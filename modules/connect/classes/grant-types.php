<?php

namespace EA11y\Modules\Connect\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class GrantTypes
 */
class GrantTypes extends Basic_Enum {
	const CLIENT_CREDENTIALS = 'client_credentials';
	const AUTHORIZATION_CODE = 'authorization_code';
	const REFRESH_TOKEN = 'refresh_token';
}
