<?php

namespace EA11y\Modules\Connect\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Config
 */
class Config {
	const APP_NAME = 'once-click-accessibility';
	const APP_PREFIX = 'ea11y';
	const APP_REST_NAMESPACE = 'ea11y';
	const BASE_URL = 'https://my.elementor.com/connect';
	const ADMIN_PAGE = 'accessibility-settings';
	const APP_TYPE = 'app_access';
	const SCOPES = 'openid offline_access share_usage_data';
	const STATE_NONCE = 'ea11y_auth_nonce';
	const CONNECT_MODE = 'site';
}
