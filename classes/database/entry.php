<?php

namespace EA11y\Classes\Database;

use EA11y\Classes\Database\Exceptions\Missing_Table_Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class DB_Entry_Base
 * This class represents a single row (or part of a record) from a database table
 * @property int|mixed|null id
 */
class Entry {


	/**
	 * @var Table $db_table
	 */
	public $db_table = null;
	protected $entry_data = [];

	/**
	 * This class should return the name of the /Table/ derivative class representing the database table holding this
	 * entry
	 * @return string - name of the class
	 */
	protected static function get_helper_class(): string {
		return '';
	}

	/**
	 * init_by
	 *
	 * Return the entry representing the first row in the table that satisfies the conditions set by the parameters
	 * and its associated data.
	 *
	 * @param string       $by    The name of the field to compare the value parameter to in case the
	 *                            /value/ parameter is a string, otherwise, ignored.
	 * @param string|array $value If a string, the value to compare against the column specified
	 *                            by the /by/ parameter.
	 *                            If an array, can be either a list of column => value entries for direct comparison
	 *                            joined with the AND logical operator, or in the format of column => [column =>
	 *                            string, value =>string|int|array<string|array>, comparison operator => string,
	 *                            relation_before=>string, optional, relation_after=>string, optional].
	 *
	 * @return Entry Returns the entry with the data found.
	 */
	private function init_by( string $by, $value ) : Entry {
		$data = static::get_by( $by, $value );

		return $this->init_by_data( $data );
	}

	/**
	 * get_by
	 *
	 * Returns the first row in the table that satisfies the conditions set by the parameters.
	 *
	 * @param string       $by    The name of the field to compare the value parameter to in case the
	 *                            /value/ parameter is a string.
	 *                            Optional.
	 *                            Defaults to an empty string.
	 * @param array|string $value If a string, the value to compare against the column specified
	 *                            by the /by/ parameter.
	 *                            If an array, can be either a list of column => value entries for direct comparison
	 *                            joined with the AND logical operator, or in the format of column => [column =>
	 *                            string, value =>string|int|array<string|array>, comparison operator => string,
	 *                            relation_before=>string, optional, relation_after=>string, optional]. Optional.
	 *                            Defaults to an empty string.
	 *
	 * @return mixed|\stdClass|null An object representing the row or NULL in case of an error.
	 */
	protected function get_by( string $by = '', $value = '' ) {
		$fields = '*';
		$where  = is_array( $value ) ? $value : [ $by => $value ];

		return $this->db_table::first( $fields, $where );
	}

	/**
	 * init_by_data
	 *
	 * Returns an Entry object with its data set to the data passed by the /data/ parameter.
	 *
	 * @param array|object $data The data to set the entry with.
	 *
	 * @return $this Returns an entry loaded with the data passes in the parameter, or en Empty entry (representing
	 *               null) on error
	 */
	protected function init_by_data( $data ) : Entry {
		if ( ! $data || is_wp_error( $data ) ) {
			return $this->return_empty();
		}

		return $this->set_data( $data );
	}

	/**
	 * return_empty
	 *
	 * Returns an empty entry project, representing an empty set/null.
	 *
	 * NOTE: An empty entry cannot be saved in the database unless you either unset the
	 * /id/ field or set it for a valid value for an update.
	 *
	 * @return Entry Returns the object back
	 */
	private function return_empty() : Entry {
		$this->set_data( [] );

		return $this->set( 'id', 0 );
	}

	/**
	 * set_data
	 *
	 * Sets the data of this entry object
	 *
	 * @param array|object $data The data to set in the current object in the format of key => value
	 *
	 * @return $this Returns the object back
	 */
	public function set_data( $data ) : Entry {
		$this->entry_data = (array) $data;

		return $this;
	}

	/**
	 * init_by_id
	 *
	 * Loads the Entry with data from the database fetched by the /id/ column compared to the value passed with the
	 * /id/ parameter.
	 *
	 * @param string $id The value of the /id/ field
	 *
	 * @return $this The Entry loaded with the data gotten from the database by the specified ID.
	 */
	protected function init_by_id( $id ) : Entry {
		$data = static::get_by( 'id', $id );

		return $this->init_by_data( $data );
	}

	/**
	 * __get
	 * magic get properties
	 *
	 * Returns an Entry's data field by key name
	 *
	 * @param string $name The name of the field to return
	 *
	 * @return mixed|null The value of the field or null if it doesn't exist'
	 */
	public function __get( $name ) {
		return $this->entry_data[ $name ] ?? null;
	}

	/**
	 * __set
	 * magic set properties
	 *
	 * Sets an Entry's data field value by the specified key
	 *
	 * @param string $name  The key of the field being set
	 * @param mixed  $value The new value for the field
	 *
	 * @return $this Returns the current object back
	 */
	public function __set( string $name, $value ) {
		return $this->set( $name, $value );
	}

	/**
	 * set
	 *
	 * Sets and entry data field value by the specified key
	 *
	 * @param string $name  The key of the field being set
	 * @param mixed  $value The new value for the field
	 *
	 * @return $this Returns the current object back
	 */
	public function set( string $name, $value ) : Entry {
		$this->entry_data[ $name ] = $value;

		return $this;
	}

	/**
	 * class_short_name
	 *
	 * Returns just the name of the class, without its namespace. Used for hooks.
	 * Taken from https://coderwall.com/p/cpxxxw/php-get-class-name-without-namespace
	 *
	 * NOTE: Called on a class without a namespace will return the name of the class
	 * without the first letter in the name
	 * @return string The name of the current class
	 */
	private function class_short_name(): string {
		$class_name = get_called_class();

		return ( substr( $class_name, strrpos( $class_name, '\\' ) + 1 ) );
	}

	/**
	 * trigger_change
	 *
	 * Raises action hooks following the create, delete and update operations.
	 * Raises the hook [ea11y/db/class_name>/change]. If the /event/
	 * parameter is not null, then it also raises the hook [ea11y/db/class_name/event].
	 *
	 * The parameters sent to both hooks is a reference to the current object and the value of the /data/ parameter.
	 *
	 * @param int|bool    $data  Numbers of rows changed or FALSE on database action failure
	 * @param string|null $event The name of the custom event hook to raise in addition to the /changed/ event hook
	 *                           Optional.
	 *                           Defaults to null. In this case, will raise only the defaults /changed/ event.
	 */
	private function trigger_change( $data, ?string $event = null ) : void {
		if ( $event ) {
			/**
			 * event specific
			 * @var Entry     $this
			 * @var false|int $data
			 */
			do_action( 'ea11y/db/' . $this->class_short_name() . '/' . $event, $this, $data );
		}

		/**
		 * entity change
		 * @var Entry     $this
		 * @var false|int $data
		 */
		do_action( 'ea11y/db/' . $this->class_short_name() . '/change', $this, $data );
	}

	/**
	 * save
	 *
	 * Writes the entry to the database.
	 * If the entry has a field called /id/ set, will
	 * perform an update, if it doesn't, will perform an insert.
	 * Update and create function triggers the change action hooks and the respective custom event
	 * @return false|int The number of rows inserted or FALSE on error.
	 */
	public function save() {
		if ( isset( $this->entry_data['id'] ) ) {
			return $this->update( [ 'id' => $this->entry_data['id'] ] );
		}

		return $this->create();
	}


	/**
	 * delete
	 *
	 * Delete entries from the table.
	 * Bases on the field specified by the /by/ parameter and its current value.
	 * Triggers change action hooks and raises the /delete/ custom event.
	 *
	 * @param string $by The field name to delete by.
	 *                   Optional.
	 *                   Defaults to 'id'.
	 *
	 * @return false|int The number of rows deleted or false on error.
	 */
	public function delete( string $by = 'id' ) {
		$results = $this->db_table::delete( [ $by => $this->{$by} ] );

		$this->trigger_change( $results, 'delete' );

		return $results;
	}

	/**
	 * update
	 *
	 * Updates the database with the data of this entry based on the conditions passed
	 * by the /where/ parameter.
	 * Triggers change action hooks and raises the /update/ custom event.
	 *
	 * NOTE: If no conditions are supplied, the update is going to be performed on all rows,
	 *
	 * @param array $where Array of column => (raw) values as a group of AND WHERE conditionals for the UPDATE
	 *                     statement. Optional. Defaults to an empty array.
	 *
	 * @return false|int The number of rows updated or false on error.
	 */
	public function update( array $where = [] ) {
		$results = $this->db_table::update( $this->entry_data, $where );

		$this->trigger_change( $results, 'update' );

		return $results;
	}

	/**
	 * create
	 *
	 * Inserts the entry to the database table.
	 * Trigger change action hooks and raises the /create/ custom event,
	 *
	 * @param string $id On successful insertion, will set the field passes in the /id/ parameter
	 *                   ot the value of the last inserted ID as returned from the database.
	 *                   Optional.
	 *                   Defaults to 'id'
	 *
	 * @return false|int The numbers of rows affected or FALSE on error
	 */
	public function create( string $id = 'id' ) {
		$results = $this->db_table::insert( $this->entry_data );
		if ( $results ) {
			// Set row id once created
			$this->set( $id, $this->db_table::db()->insert_id );
		}

		$this->trigger_change( $results, 'create' );

		return $results;
	}

	/**
	 * reset
	 *
	 * Clears all of this entry's data.
	 */
	public function reset(): void {
		$this->entry_data = [];
	}

	/**
	 * @return bool
	 */
	public function exists(): bool {
		return isset( $this->entry_data['id'] ) && 0 < $this->entry_data['id'];
	}

	/**
	 * to_json
	 * @return string
	 */
	public function to_json() : string {
		return json_encode( $this->entry_data );
	}

	public function get_data() {
		return $this->entry_data;
	}

	public function to_array() {
		return $this->get_data();
	}

	/**
	 * DB_Entry_Base constructor.
	 * Uses the passed on arguments to initialize/set the Entry.
	 * Will through an exception in case the Entry's table property is not set correctly, and the /Table/ class
	 * linking this entry to a database table is not found.
	 *
	 * @param array $args The arguments to set this Entry by.
	 *                    If arguments /by/ and /value/ are set,
	 *                    will fetch the data according to the column name specified by /by/ and the value(s) specified
	 *                    by /value/. See doc for /init_by/ for details.
	 *
	 * if argument /data/ is set, will set the Entry's data with the data specified.
	 * See doc for /init_by_data/ for details.
	 *
	 * if argument /id/ is specified, will load the data of the row whose /id/ column has the value specified by the
	 * argument.
	 *
	 * Optional.
	 * Defaults to an empty array which will make this entry as the Empty Entry representing null,
	 * which cannot be saved unless properly modified to a non-null entry.
	 *
	 * @throws Missing_Table_Exception If the Entry table property is not found.
	 */
	public function __construct( array $args = [] ) {
		$this->db_table = static::get_helper_class();

		if ( empty( $this->db_table ) ) {
			throw new Missing_Table_Exception();
		}
		if ( isset( $args['by'] ) && isset( $args['value'] ) ) {
			return $this->init_by( $args['by'], $args['value'] );
		}

		if ( isset( $args['data'] ) ) {
			return $this->init_by_data( $args['data'] );
		}

		if ( isset( $args['id'] ) ) {
			return $this->init_by_id( $args['id'] );
		}

		return $this->return_empty();
	}
}
