<?php

namespace EA11y\Modules\Analytics\Database;

use EA11y\Classes\Database\Database_Constants;
use EA11y\Classes\Database\Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Analytics_Table extends Table {
	// override base's const:
	const DB_VERSION = '1';
	const DB_VERSION_FLAG_NAME = 'ea11y_analytics_db_version';

	const ID = 'id';
	const EVENT = 'event';
	const VALUE = 'value';
	const CREATED_AT = 'created_at';

	// TODO: Review lists of events and elements
	const EVENTS = [ 'bigger_text', 'line_height' ];

	public static $table_name = 'ea11y_analytics';

	public static function get_columns(): array {
		return [
			self::ID => [
				'type'  => Database_Constants::get_col_type( Database_Constants::INT, 11 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::UNSIGNED,
					Database_Constants::NOT_NULL,
					Database_Constants::AUTO_INCREMENT,
				] ),
				'key'   => Database_Constants::get_primary_key_string( self::ID ),
			],
			self::EVENT => [
				'type'  => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::NOT_NULL,
				] ),
			],
			self::VALUE => [
				'type'  => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::CREATED_AT => [
				'type'  => Database_Constants::get_col_type( Database_Constants::DATETIME ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::NOT_NULL,
					Database_Constants::DEFAULT,
					Database_Constants::CURRENT_TIMESTAMP,
				] ),
			],
		];
	}

	/**
	 * build_sql_string
	 * add GROUP BY to Table::build_sql_string
	 *
	 */
	public static function build_sql_string( $fields = '*', $where = '1', int $limit = null, int $offset = null, string $join = '', array $order_by = [], $group_by = '' ): string {
		if ( is_array( $fields ) ) {
			$fields = implode( ', ', $fields );
		}

		$db = static::db();
		$query_string = 'SELECT %s FROM %s %s WHERE %s';
		$query_string = sprintf( $query_string,
			$fields,
			static::table_name(),
			$join,
			static::where( $where )
		);

		if ( is_array( $group_by ) ) {
			$group_by = implode( ', ', $group_by );
		}

		if ( $group_by ) {
			$query_string .= esc_sql( ' GROUP BY ' . $group_by );
		}

		if ( $order_by ) {
			$query_string .= static::build_order_by_sql_string( $order_by );
		}

		if ( $limit ) {
			$query_string .= $db->prepare( ' LIMIT %d', $limit );
		}

		if ( $offset ) {
			$query_string .= $db->prepare( ' OFFSET %d', $offset );
		}

		return $query_string;
	}
}
