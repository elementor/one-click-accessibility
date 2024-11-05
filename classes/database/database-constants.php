<?php

namespace EA11y\Classes\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Database_Constants {
	// column types
	const INT = 'INT';
	const VARCHAR = 'VARCHAR';
	const TEXT = 'TEXT';
	const LONGTEXT = 'LONGTEXT';
	const DATETIME = 'DATETIME';
	const TIMESTAMP = 'TIMESTAMP';
	const ENUM = 'ENUM';
	const BOOLEAN = 'BOOLEAN';
	const TINYINT = 'TINYINT';

	// Flags
	const NOT_NULL = 'NOT NULL';
	const NULL = 'NULL';
	const DEFAULT = 'DEFAULT';
	const AUTO_INCREMENT = 'AUTO_INCREMENT';
	const COMMENT = 'COMMENT';
	const UNSIGNED = 'UNSIGNED';
	const ON_UPDATE = 'ON UPDATE';
	const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP';

	const KEY = 'KEY';
	const PRIMARY_KEY = 'PRIMARY KEY';
	const UNIQUE = 'UNIQUE';

	public static function get_col_type( $type, $length = null ) {
		switch ( $type ) {
			case self::INT:
				return 'INT(' . $length . ')';
			case self::VARCHAR:
				return 'VARCHAR(' . $length . ')';
			case self::TEXT:
				return 'TEXT';
			case self::LONGTEXT:
				return 'LONGTEXT';
			case self::DATETIME:
				return 'DATETIME';
			case self::TIMESTAMP:
				return 'TIMESTAMP';
			case self::ENUM:
				return 'ENUM(' . $length . ')';
			case self::BOOLEAN:
				return 'BOOLEAN';
			case self::TINYINT:
				return 'TINYINT(' . $length . ')';
			default:
				return 'VARCHAR(255)';
		}
	}

	public static function build_flags_string( $flags = [] ): string {
		return implode( ' ', $flags );
	}

	public static function build_key_string( $key, $column, $key_name = null ): string {
		$key_name = $ke_name ?? $column;

		return $key . ' `' . $key_name . '` (`' . $column . '`)';
	}

	public static function get_primary_key_string( $column ): string {
		return 'PRIMARY KEY (`' . $column . '`)';
	}
}
