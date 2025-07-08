<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\{Database_Constants, Table};

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Page_Table extends Table {
	// override base's const:
	const DB_VERSION = '2';
	const DB_VERSION_FLAG_NAME = 'ea11y_page_scanned_db_version';

	const ID = 'id';
	const URL = 'url';
	const TITLE = 'title';
	const OBJECT_ID = 'object_id';
	const OBJECT_TYPE = 'object_type';
	const OBJECT_TYPE_NAME = 'object_type_name';
	const HASH = 'hash';
	const FULL_HTML = 'full_html';
	const VIOLATIONS = 'violations';
	const RESOLVED = 'resolved';
	const STATUS = 'status';
	const CREATED_AT = 'created_at';
	const UPDATED_AT = 'updated_at';

	const STATUSES = [
		'ACTIVE' => 'active',
		'DISABLED' => 'disabled',
	];

	public static $table_name = 'ea11y_page_scanned';

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
			self::TITLE => [
				'type' => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::OBJECT_ID => [
				'type' => Database_Constants::get_col_type( Database_Constants::INT, 11 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					0,
				] ),
			],
			self::OBJECT_TYPE => [
				'type' => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::OBJECT_TYPE_NAME => [
				'type' => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::HASH => [
				'type' => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::NOT_NULL,
				] ),
				'key' => Database_Constants::build_key_string( Database_Constants::KEY, self::HASH ),
			],
			self::FULL_HTML => [
				'type' => Database_Constants::get_col_type( Database_Constants::LONGTEXT ),
			],
			self::VIOLATIONS => [
				'type' => Database_Constants::get_col_type( Database_Constants::INT, 11 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					0,
				] ),
			],
			self::RESOLVED => [
				'type' => Database_Constants::get_col_type( Database_Constants::INT, 11 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					0,
				] ),
			],
			self::STATUS => [
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
