<?php

namespace EA11y\Modules\Analytics\Database;

use EA11y\Classes\Database\Entry;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Analytics_Entry
 */
class Analytics_Entry extends Entry {
	/**
	 * @var string
	 */
	public string $event;

	/**
	 * @var string
	 */
	public string $element;

	/**
	 * @var string|null
	 */
	public ?string $value;

	public static function get_helper_class(): string {
		return Analytics_Table::get_class_name();
	}

	/**
	 * Get data for diagrams
	 * @param string $period
	 *
	 * @return array
	 */
	public static function get_data_dates_grouped( string $period ): array {
		$fields = 'DATE(created_at) AS date, COUNT(*) AS total';
		$where = [
			[
				'column' => 'created_at',
				'value' => $period,
				'operator' => '>',
			],
		];
		$order_by = [ 'date' => 'DESC' ];
		$group_by = 'date';
		$query = Analytics_Table::build_sql_string( $fields, $where, null, null, '', $order_by, $group_by );
		return Analytics_Table::db()->get_results( $query );
	}

	/**
	 * Get data for diagrams
	 * @param string $period
	 *
	 * @return array
	 */
	public static function get_data_elements_grouped( string $period ): array {
		$fields = 'element, COUNT(*) AS total';
		$where = [
			[
				'column' => 'created_at',
				'value' => $period,
				'operator' => '>',
			],
		];
		$order_by = [ 'total' => 'DESC' ];
		$group_by = 'element';
		$query = Analytics_Table::build_sql_string( $fields, $where, null, null, '', $order_by, $group_by );
		return Analytics_Table::db()->get_results( $query );
	}

	/**
	 * @param string $event
	 * @param string $element
	 *
	 * @return bool
	 */
	public static function validate_item( string $event, string $element ): bool {
		return (
			in_array( $event, Analytics_Table::EVENTS, true ) &&
			in_array( $element, Analytics_Table::ELEMENTS, true )
		);
	}

	/**
	 * Delete events oldest then 45 days
	 * @return void
	 */
	public static function delete_expired_entries() {
		$query = 'DELETE FROM `' . Analytics_Table::table_name() . '` WHERE `' . Analytics_Table::CREATED_AT . '` < NOW() - INTERVAL 45 DAY';
		Analytics_Table::query( $query );
	}
}
