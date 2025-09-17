<?php

namespace EA11y\Classes\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Table
 * This class represents a database table
 */
class Table {
	/**
	 * The current table version. Will be compared to the version installed in the database
	 */
	const DB_VERSION = '1';
	/**
	 * Should hold the name of the WordPress option to hold the database version
	 */
	const DB_VERSION_FLAG_NAME = '';

	/**
	 * @var string database table name
	 */
	public static $table_name = '';

	/**
	 * @var bool flag whether the table name is already prefixed or not
	 */
	protected static $table_prefixed = false;

	/**
	 * Get a reference to the WordPress database object.
	 * @return \wpdb A reference to the WordPress database object
	 */
	public static function db(): \wpdb {
		global $wpdb;
		if ( ! static::$table_prefixed ) {
			static::$table_prefixed = true;
			static::set_table_prefix();
		}
		return $wpdb;
	}

	/**
	 * table_name
	 *
	 * Returns the name of the table including the table prefix
	 * @return string The full name of the table
	 */
	public static function table_name(): string {
		return self::db()->prefix . static::$table_name;
	}

	/**
	 * set_table_prefix
	 *
	 * Saves the table name as a property in the WP database object and
	 * sets it value to the table name and its prefix.
	 */
	protected static function set_table_prefix(): void {
		static::db()->{static::$table_name} = static::table_name();
	}

	/**
	 * get_columns
	 *
	 * Should return an array of table columns details in the format of
	 * column_name => [ type => db_type, key => key_data (optional), flags => other_modifiers (optional) ]
	 *
	 * NOTE: A primary key column named /id/ which is an auto-incremented int/big int is assumed to exist and must be one
	 * of the columns this function returns.
	 * @return array The table column data.
	 */
	public static function get_columns(): array {
		return [];
	}

	/**
	 * get_extra_keys
	 *
	 * Extra keys to the table definitions to be merged with column key definitions
	 * @return string[] SQL table key definitions
	 */
	protected static function get_extra_keys(): array {
		return [];
	}

	/**
	 * get_keys
	 *
	 * Extracts the key definitions from the table's columns and merges with
	 * any extra key definitions
	 * @return string[] SQL table key definitions
	 */
	protected static function get_keys(): array {
		$columns = static::get_columns();
		$keys = [];
		foreach ( $columns as $column ) {
			if ( ! isset( $column['key'] ) ) {
				continue;
			}
			$keys[] = $column['key'];
		}
		return array_merge( $keys, static::get_extra_keys() );
	}

	/**
	 * install
	 *
	 * This function compares the version of the installed table and the current version as reported by
	 * the class.
	 * If the versions are different, the table will be installed or updated, and the option
	 * will be set to the current version.
	 */
	public static function install(): void {
		$installed_ver = get_option( static::DB_VERSION_FLAG_NAME, -1 );

		if ( static::DB_VERSION !== $installed_ver ) {

			$sql = static::get_create_table_sql();

			require_once ABSPATH . 'wp-admin/includes/upgrade.php';
			dbDelta( $sql );

			update_option( static::DB_VERSION_FLAG_NAME, static::DB_VERSION, false );
		}

		static::set_table_prefix();
	}

	/**
	 * get_create_table_sql
	 *
	 * Generates the SQL command to run in the database to create the table
	 * based on the definitions of columns and keys.
	 * @return string The SQL command to create the table
	 */
	protected static function get_create_table_sql(): string {
		$table = static::table_name();
		$keys = static::get_keys();
		$charset_collate = static::db()->get_charset_collate();
		$table_columns = [];
		$sql = [];
		$sql[] = 'CREATE TABLE ' . $table . ' (';
		$columns = static::get_columns();
		foreach ( $columns as $column_name => $column ) {
			$table_columns[] = sprintf( '`%s` %s %s,',
				$column_name,
				$column['type'],
				$column['flags'] ?? ''
			);
		}

		$sql[] = "\t" . implode( "\n\t", $table_columns );
		$sql[] = "\t" . implode( ",\n\t", $keys );
		$sql[] = ") AUTO_INCREMENT=11 {$charset_collate};";
		return implode( "\n", $sql );
	}

	/**
	 * where
	 *
	 * Generates a proper WHERE clause for an SQL query.
	 * @param string|array $where Either a string of where clause (returns as is) or an array of
	 * conditions join with an AND, and in the format of column => (int|string) for exact value comparison
	 * or in the format of column => [column => string, value =>string|int|array<string|array>,
	 * comparison operator => string, relation_before=>string, optional, relation_after=>string, optional]
	 *
	 * @return string WHERE clause built from the function input
	 */
	public static function where( $where ): string {
		if ( ! is_array( $where ) ) {
			return $where;
		}
		$needs_relationship = false;
		$where_string = '';
		foreach ( $where as $key => $filter ) {
			if ( ! is_array( $filter ) ) {
				if ( $needs_relationship ) {
					$where_string .= ' AND';
				}
				$where_string .= ' ' . self::get_where_string( $key, $filter );
				$needs_relationship = true;
				continue;
			}

			$where_string .= self::maybe_add_relation( $filter );
			$where_string .= self::get_where_string( $filter['column'], $filter['value'], $filter['operator'] );
			$where_string .= self::maybe_add_relation( $filter, false );

		}
		return $where_string;

	}

	/**
	 * maybe_add_relation
	 *
	 * Adds a logical relation ship (AND, OR...) if exists, based on the position (before|after) related to the condition.
	 * @param array $filter Object array describing the where condition that may contain the keys /relation_before/
	 * or /relation_after/ containing the logical relationship to add to the main WHERE condition.
	 * @param bool $is_before Whether the current position in the text is before the condition the object describes.
	 * Optional.
	 * Defaults to TRUE.
	 *
	 * @return string If the logical relationship exists, returns it. Otherwise - an empty string.
	 */
	private static function maybe_add_relation( array $filter, bool $is_before = true ): string {
		$key_to_check = $is_before ? 'relation_before' : 'relation_after';
		return isset( $filter[ $key_to_check ] ) ? ' ' . $filter[ $key_to_check ] : ' ';
	}

	/**
	 * get_where_string
	 *
	 * @param string $key The column name in the condition
	 * @param string|int|array $value The value being compared. If an array will be translated to a set.
	 * @param string $operator The comparison operator.
	 * Optional.
	 * Defaults to '='.
	 * @param null $format Unused.
	 *
	 * @return string An SQL condition based on the parameters.
	 */
	private static function get_where_string( string $key, $value, string $operator = '=', $format = null ): string {
		$param_string = is_int( $value ) ? '%d' : '%s';
		if ( is_array( $value ) ) {
			$param_string = '(';
			$count = count( $value );
			for ( $i = 0; $i < $count; $i++ ) {
				$param_string .= is_int( $value[ $i ] ) ? '%d' : '%s';
				$param_string .= ( $i !== $count - 1 ) ? ', ' : '';
			}
			$param_string .= ')';
		}
		return static::db()->prepare( "$key $operator $param_string", $value );
	}

	/**
	 * get_columns_for_insert
	 * This function tries to get the column names for an INSERT operation based on the table column
	 * definition, and if that fails based on the /data/ parameter.
	 * The function will remove any column called /id/.
	 * @param mixed $data If a two-dimensional array, where the elements are in the form of column => value,
	 * the function will try to get the names of the columns off the first element.
	 *
	 * @return false|string A string representing the list of columns, comma separated and surrounded by parenthesis;
	 * or false in case of function failure.
	 */
	private static function get_columns_for_insert( $data ) {
		$cols = static::get_columns();
		if ( count( $cols ) ) {
			$columns = array_keys( $cols );
		} elseif ( is_array( $data ) ) {
			//try to get from data
			$columns = array_keys( $data[0] );
		}

		if ( empty( $columns ) || ! is_array( $columns ) ) {
			return false;
		}

		// remove id $column
		if ( ! empty( $columns['id'] ) ) {
			unset( $columns['id'] );
		}
		$index = array_search( 'id', $columns, true );
		if ( false !== $index ) {
			unset( $columns[ $index ] );
		}

		return ' (`' . implode( '`,`', $columns ) . '`) ';
	}

	/**
	 * select_var
	 *
	 * Selects a single cell in the table and returns its value as string.
	 * Will return the first cell of the first row in the result set.
	 * @param string|array $fields A string of comma-separated list, or an array of columns from the table.
	 * Optional.
	 * Defaults to '*' (all table columns)
	 * @param string|array $where A string of WHERE conditions or an array of column => value entries connected with the
	 * AND logical operator. Or in the format of column => [column => string, value =>string|int|array<string|array>,
	 * comparison operator => string, relation_before=>string, optional, relation_after=>string, optional]
	 * Optional.
	 * Defaults tp '1', which is evaluated to true and will bring all records (no condition).
	 * @param int|null $limit Limit the number of results to return to this number, or NULL for no limit.
	 * Optional.
	 * Defaults to NULL (no limit)
	 * @param int|null $offset Skip this number of results or NULL for no skip
	 * Optional.
	 * Defaults to NULL (no offset)
	 * @param string $join JOIN table clause.
	 * Optional.
	 * Defaults to an empty string (no join)
	 *
	 * @return string|null The query result or NULL on error.
	 */
	public static function select_var( $fields = '*', $where = '1', ?int $limit = null, ?int $offset = null, string $join = '' ): ?string {
		return static::db()->get_var( static::build_sql_string( $fields, $where, $limit, $offset, $join ) );
	}

	/**
	 * build_sql_string
	 *
	 * Generates a SELECT query based on the function input.
	 * @param string|array $fields A string of comma-separated list, or an array of columns from the table.
	 * Optional.
	 * Defaults to '*' (all table columns)
	 * @param string|array $where A string of WHERE conditions or an array of column => value entries connected with
	 * the AND logical operator. r in the format of column => [column => string, value =>string|int|array<string|array>,
	 * comparison operator => string, relation_before=>string, optional, relation_after=>string, optional]
	 * Optional.
	 * Defaults to '1', which is evaluated to true and will bring all records (no condition).
	 * @param int|null $limit Maximum number of results to return.
	 * Optional.
	 * Defaults to NULL (no limit)
	 * @param int|null $offset Start the results from a certain ordinal position.
	 * Optional.
	 * Defaults to NULL (no offset)
	 * @param string $join A table JOIN clause.
	 * Optional.
	 * Defaults to an empty string (no join)
	 * @param array $order_by an array of column => direction (asc|desc) to sort the results by.
	 * Optional.
	 * Defaults to an empty array (Default sort).
	 * @param string|array $group_by A table CROUP BY clause.
	 *  Optional.
	 *  Defaults to an empty string (no group)
	 *
	 * @return string The SQL SELECT statement built according to the function parameters.
	 */
	private static function build_sql_string( $fields = '*', $where = '1', ?int $limit = null, ?int $offset = null, string $join = '', array $order_by = [], $group_by = '' ): string {
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

	/**
	 * build_order_by_sql_string
	 *
	 * Generates the ORDER BY clause of the query based on the passed on parameter
	 * @param array<string, string> $order_by An array of column => direction (asc/desc) pairs
	 *
	 * @return string The ORDER BY clause for a query
	 */
	public static function build_order_by_sql_string( array $order_by ): string {
		return ' ORDER BY ' . implode( ', ', array_map( function( $column, $direction ) {
			return "{$column} {$direction}";
		}, array_keys( $order_by ), $order_by ) );
	}

	/**
	 * select
	 *
	 * Runs a SELECT query and returns the results as an array of objects, each object represents a row,
	 * @param string|array $fields A string of comma-separated list, or an array of columns from the table.
	 * Optional.
	 * Defaults to '*' (all table columns)
	 * @param string|array $where A string of WHERE conditions, or an array of column => value enteries
	 * for direct comparison joined with the AND logical operator, or in the format of column => [column => string, value =>string|int|array<string|array>,
	 * comparison operator => string, relation_before=>string, optional, relation_after=>string, optional]
	 * Optional.
	 * Defaults to '1', which is evaluated to true and will bring all records (no condition).
	 * @param int|null $limit Maximum number of results to return.
	 * Optional.
	 * Defaults to NULL (no limit)
	 * @param int|null $offset Start the results from a certain ordinal position.
	 * Optional.
	 * Defaults to NULL (no offset)
	 * @param string|array $join A table JOIN clause.
	 * Optional.
	 * Defaults to an empty string (no join)
	 * @param array $order_by an array of column => direction (asc|desc) to sort the results by.
	 * Optional.
	 * Defaults to an empty array (Default sort).
	 * @param string|array $group_by A table CROUP BY clause.
	 * Optional.
	 * Defaults to an empty string (no group)
	 *
	 * @return array|object|\stdClass[]|null On success, an array of objects. Null on error.
	 */
	public static function select( $fields = '*', $where = '1', ?int $limit = null, ?int $offset = null, $join = '', array $order_by = [], $group_by = '' ) {
		// TODO: handle $wpdb->last_error
		$query = static::build_sql_string( $fields, $where, $limit, $offset, $join, $order_by, $group_by );
		return static::db()->get_results( $query );
	}

	/**
	 * get_col
	 *
	 * Returns the first column of the result set.
	 * @param string $column The column to return.
	 * Optional.
	 * Defaults to an empty string.
	 * @param string|array $where A string of WHERE conditions or an array of column => value entries
	 * for direct comparison joined with the AND logical operator or in the format of column => [column => string, value =>string|int|array<string|array>,
	 * comparison operator => string, relation_before=>string, optional, relation_after=>string, optional]
	 * Optional.
	 * Defaults to '1', which is evaluated to true and will bring all records (no condition).
	 * @param int|null $limit Maximum number of results to return.
	 * Optional.
	 * Defaults to NULL (no limit)
	 * @param int|null $offset Start the results from a certain ordinal position.
	 * Optional.
	 * Defaults to NULL (no offset)
	 * @param string $join A table JOIN clause.
	 * Optional.
	 * Defaults to an empty string (no join)
	 * @param array $order_by an array of column => direction (asc|desc) to sort the results by.
	 * Optional.
	 * Defaults to an empty array (Default sort).
	 *
	 * @return string[] Array of the values of the column as strings, or an empty one on error.
	 */
	public static function get_col( string $column = '', $where = '1', ?int $limit = null, ?int $offset = null, string $join = '', array $order_by = [] ) : array {
		return static::db()->get_col( static::build_sql_string( $column, $where, $limit, $offset, $join, $order_by ) );
	}

	/**
	 * first
	 *
	 * Returns the first row in the table according to the query filters.
	 * @param string|array $fields A string of comma-separated list, or an array of columns from the table.
	 * Optional.
	 * Defaults to '*' (all table columns)
	 * @param string|array $where A string of WHERE conditions or an array of column => value entries
	 * for direct comparison joined with the logical AND operator,
	 * or in the format of column => [column => string, value =>string|int|array<string|array>,
	 * comparison operator => string, relation_before=>string, optional, relation_after=>string, optional]
	 * Optional.
	 * Defaults to '1', which is evaluated to true and will bring all records (no condition).
	 * @param int $limit Unnecessary since we are only returning the first row.
	 * Optional.
	 * Defaults to 1.
	 * @param null $offset Start the results from a certain ordinal position.
	 * Optional.
	 * Defaults to NULL (no offset)
	 * @param string $join A table JOIN clause.
	 * Optional.
	 * Defaults to an empty string (no join)
	 *
	 * @return \stdClass|null An object representing the first row, or null on error
	 */
	public static function first( $fields = '*', $where = '1', int $limit = 1, $offset = null, string $join = '' ): ?\stdClass {
		$result = static::select( $fields, $where, $limit, $offset, $join );
		return ( ! empty( $result[0] ) ) ? $result[0] : null;
	}

	/**
	 * replace
	 *
	 * Replace a row in a table if it exists or insert a new row in a table if the row does not already exist.
	 * @param array $data Array of data in the form of column => (raw) value.
	 * Optional.
	 * Defaults to an empty array.
	 *
	 * @return false|int The number of rows affected or FALSE on error.
	 */
	public static function replace( array $data = [] ) {
		return static::db()->replace( static::table_name(), $data );
	}

	/**
	 * insert
	 *
	 * Insert a single row into the table.
	 * @param array $data Array of data to insert in column => (raw) value format.
	 * Optional, defaults to an empty array.
	 *
	 * @return false|int The number of rows affected or FALSE on error
	 */
	public static function insert( array $data = [] ) {
		return static::db()->insert( static::table_name(), $data );
	}

	/**
	 * insert_many
	 * Performs a bulk INSERT of many datasets/rows to the table
	 *
	 * @param array $data Optional. Defaults to an empty array.
	 * An array of datasets to be INSERTed into the table. Each value needs to be seperated by a comma,
	 * each data set needs to be surrounded by parenthesis.
	 * @param string|null $columns Optional. The columns being inserted. Defaults to NULL.
	 * Either a string of comma-separated column names surrounded by parenthesis, or NULL for the
	 * function to try guessing based on the data and column definitions.
	 *
	 * @return false|int Number of rows affected or false on error
	 */
	public static function insert_many( array $data = [], ?string $columns = null ) {
		if ( null === $columns ) {
			$columns = static::get_columns_for_insert( $data );
			if ( ! $columns ) {
				return false;
			}
		}
		$insert_sql = 'INSERT INTO ' . static::table_name() . $columns . ' VALUES ' . implode( ",\n", $data ) . ';';
		return static::db()->query( $insert_sql ); // no params so no need for `prepare`.
	}

	/**
	 * update
	 *
	 * Updates data in the table, based on where conditionals
	 * @param array<string, mixed> $data Optional. Array of column => (raw) values to be updated.
	 * Defaults to an empty array.
	 * @param array<string, mixed> $where Optional. Array of column => (raw) values as a group of AND
	 * WHERE conditionals for the UPDATE statement. Defaults to an empty array.
	 *
	 * @return false|int The numbers of rows affected, or FALSE on error
	 */
	public static function update( array $data = [], array $where = [] ) {
		return static::db()->update( static::table_name(), $data, $where );
	}

	/**
	 * delete
	 *
	 * Delete rows from this table based on optional where conditions.
	 *
	 * @param array<string, mixed> $where Optional. And array of column => (raw) values
	 * as a group of AND conditions for the DELETE statement. Defaults to an empty array.
	 *
	 * @return false|int The number of rows updated, or false on error.
	 */
	public static function delete( array $where = [] ) {
		return static::db()->delete( static::table_name(), $where );
	}

	/**
	 * query
	 *
	 * Execute any SQL query on the database.
	 * It is best used when there is a need for specific,
	 * custom, or otherwise complex SQL queries.
	 * @param string $query The query to be executed. Defaults to an empty string
	 *
	 * @return false|int Boolean true for CREATE, ALTER, TRUNCATE and DROP queries.
	 * Number of rows affected/selected for all other queries. Boolean false on error.
	 */
	public static function query( string $query = '' ) {
		return static::db()->query( $query );
	}

	/**
	 * get_class_name
	 *
	 * Returns the name of this /Table/ class (or its derivative)
	 * @return string - The name of the current class
	 */
	public static function get_class_name(): string {
		return get_called_class();
	}
}
