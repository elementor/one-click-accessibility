<?php

require __DIR__ . '/../vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- CLI
	throw new Exception( "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh?" ); // NOSONAR
}

// Give access to tests_add_filter() function.
/** @psalm-suppress UnresolvableInclude */
require_once $_tests_dir . '/includes/functions.php';

function _manually_load_plugin(): void {
	require dirname( __DIR__ ) . '/pojo-accessibility.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
/** @psalm-suppress UnresolvableInclude */
require $_tests_dir . '/includes/bootstrap.php';

// @phpcs:disable

//module tests
include_once dirname( __DIR__ ) . '/tests/phpunit/helpers/module-test-base.php';
//rest tests
include_once dirname( __DIR__ ) . '/tests/phpunit/helpers/route-test.php';
//test base with factories
include_once dirname( __DIR__ ) . '/tests/phpunit/helpers/test-base.php';
// functions
include_once dirname( __DIR__ ) . '/tests/phpunit/helpers/functions.php';
// phpcs:enable
