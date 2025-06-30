<?php

namespace EA11y\Modules\Scanner\Database;

use EA11y\Classes\Database\{Database_Constants, Table};

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Scans_Table
 */
class Scans_Table extends Table {
	// override base's const:
	const DB_VERSION = '2';
	const DB_VERSION_FLAG_NAME = 'ea11y_scanner_results_db_version';

	const ID = 'id';
	const URL = 'url';
	const RESULTS = 'results';
	const SUMMARY = 'summary';
	const CREATED_AT = 'created_at';
	const UPDATED_AT = 'updated_at';

	public static $table_name = 'ea11y_scanner_results';

	public static function get_columns(): array {
		return [
			self::ID => [
				'type' => Database_Constants::get_col_type( Database_Constants::INT, 11 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::UNSIGNED,
					Database_Constants::NOT_NULL,
					Database_Constants::AUTO_INCREMENT,
				] ),
				'key' => Database_Constants::get_primary_key_string( self::ID ),
			],
			self::URL => [
				'type' => Database_Constants::get_col_type( Database_Constants::VARCHAR, 2048 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
				'key' => Database_Constants::build_key_string( Database_Constants::KEY, self::URL ),
			],
			self::RESULTS => [
				'type' => Database_Constants::get_col_type( Database_Constants::TEXT ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::SUMMARY => [
				'type' => Database_Constants::get_col_type( Database_Constants::TEXT ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::CREATED_AT => [
				'type' => Database_Constants::get_col_type( Database_Constants::DATETIME ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::NOT_NULL,
					Database_Constants::DEFAULT,
					Database_Constants::CURRENT_TIMESTAMP,
				] ),
			],
			self::UPDATED_AT => [
				'type' => Database_Constants::get_col_type( Database_Constants::DATETIME ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::NOT_NULL,
					Database_Constants::DEFAULT,
					Database_Constants::CURRENT_TIMESTAMP,
					Database_Constants::ON_UPDATE,
					Database_Constants::CURRENT_TIMESTAMP,
				] ),
			],
		];
	}
}
