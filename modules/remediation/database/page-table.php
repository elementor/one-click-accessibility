<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\{
	Table,
	Database_Constants
};

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Page_Table extends Table {
	// override base's const:
	const DB_VERSION = '1';
	const DB_VERSION_FLAG_NAME = 'ea11y_page_db_version';

	const ID = 'id';
	const URL = 'url';
	const OBJECT_ID = 'object_id';
	const OBJECT_TYPE = 'object_type';
	const OBJECT_TYPE_NAME = 'object_type_name';
	const HASH = 'hash';
	const REMEDIATIONS = 'remediations';
	const FULL_HTML = 'full_html';
	const CREATED_AT = 'created_at';
	const UPDATED_AT = 'updated_at';

	public static $table_name = 'ea11y_page_remediations';

	/**
	 * install
	 *
	 * This function compares the version of the installed table and the current version as reported by
	 * the class.
	 * If the versions are different, the table will be installed or updated, and the option
	 * will be set to the current version.
	 */
	public static function install(): void {
		$installed_ver = get_option( static::DB_VERSION_FLAG_NAME, - 1 );

		if ( static::DB_VERSION !== $installed_ver ) {

			self::run_migration( $installed_ver );

			$sql = static::get_create_table_sql();

			require_once ABSPATH . 'wp-admin/includes/upgrade.php';
			dbDelta( $sql );

			update_option( static::DB_VERSION_FLAG_NAME, static::DB_VERSION, false );
		}

		static::set_table_prefix();
	}

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
				'type' => Database_Constants::get_col_type( Database_Constants::TEXT ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
				'key' => Database_Constants::build_key_string( Database_Constants::KEY, self::URL ),
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
			self::REMEDIATIONS => [
				'type' => Database_Constants::get_col_type( Database_Constants::TEXT ),
			],
			self::FULL_HTML => [
				'type' => Database_Constants::get_col_type( Database_Constants::LONGTEXT ),
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
