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
				'relation_after' => 'AND',
			],
			[
				'column' => 'event',
				'value' => 'widget-open',
				'operator' => '=',
			],
		];
		$order_by = [ 'date' => 'ASC' ];
		$group_by = 'date';
		return Analytics_Table::select( $fields, $where, null, null, '', $order_by, $group_by );
	}

	/**
	 * Get data for diagrams
	 * @param string $period
	 *
	 * @return array
	 */
	public static function get_data_events_grouped( string $period ): array {
		$fields = 'event, value, COUNT(*) AS total';
		$where = [
			[
				'column' => 'created_at',
				'value' => $period,
				'operator' => '>',
				'relation_after' => 'AND',
			],
			[
				'column' => 'event',
				'value' => 'widget-open',
				'operator' => '<>',
			],
		];
		$order_by = [ 'total' => 'DESC' ];
		$group_by = [ 'event', 'value' ];
		return Analytics_Table::select( $fields, $where, null, null, '', $order_by, $group_by );
	}

	/**
	 * @param string $event
	 *
	 * @return bool
	 */
	public static function validate_item( string $event ): bool {
		return in_array( $event, Analytics_Table::EVENTS, true );
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
