<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Modules\Remediation\Exceptions\Missing_URL;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Page_Entry
 */
class Remediation_Entry extends Entry {
	/**
	 * @var string $url holds page url
	 */
	private string $url;

	public static function get_helper_class(): string {
		return Remediation_Table::get_class_name();
	}

	/**
	 * Create
	 *
	 * used to ensure:
	 *      URL is set
	 *
	 * @param string $id
	 *
	 * @throws Missing_URL
	 */
	public function create( string $id = 'id' ) {
		if ( empty( $this->entry_data[ Remediation_Table::URL ] ) ) {
			throw new Missing_URL();
		}
		$date_time = gmdate( 'Y-m-d H:i:s' );
		$this->entry_data[ Remediation_Table::CREATED_AT ] = $date_time;
		$this->entry_data[ Remediation_Table::UPDATED_AT ] = $date_time;

		parent::create( $id );
	}

	/**
	 * Remove
	 *
	 * @param string $by
	 * @param string $by_value
	 * @param string|null $group
	 */
	public static function remove( string $by, string $by_value, ?string $group = null ) {
		$where = $group ? [
			$by => $by_value,
			Remediation_Table::GROUP => $group,
			Remediation_Table::GLOBAL => 0,
		] : [
			$by => $by_value,
			Remediation_Table::GLOBAL => 0,
		];
		Remediation_Table::delete( $where );
	}

	/**
	 *  get_page_remediations
	 *
	 * @param string $url
	 * @return array
	 */
	public static function get_page_remediations( string $url ) : array {
		$excluded_table = Exclude_Remediation_Relationship_Table::table_name();
		$remediation_table = Remediation_Table::table_name();

		$where = [
			[
				'column' => Remediation_Table::URL,
				'value' => $url,
				'operator' => '=',
				'relation_after' => 'AND',
			],
			[
				'column' => Remediation_Table::GLOBAL,
				'value' => 1,
				'operator' => '<>',
			],
		];
		$global_where = [
			[
				'column' => "$remediation_table.global",
				'value' => 1,
				'operator' => '=',
			],
		];
		$join = "LEFT JOIN $excluded_table ON $remediation_table.id = $excluded_table.remediation_id AND $excluded_table.page_url = '$url'";

		return [
			'page' => Remediation_Table::select( '*', $where ),
			'global' => Remediation_Table::select( "$remediation_table.*, $excluded_table.id AS excluded", $global_where, null, null, $join ),
		];
	}

	/**
	 *  Get count of page remediations
	 *
	 * @param string $url
	 * @return array
	 */
	public static function get_page_remediations_count( string $url ) : array {
		$where = [
			[
				'column' => Remediation_Table::URL,
				'value' => $url,
				'operator' => '=',
				'relation_after' => 'AND',
			],
			[
				'column' => Remediation_Table::GLOBAL,
				'value' => 1,
				'operator' => '<>',
			],
		];

		return Remediation_Table::select( 'COUNT(*) as total', $where );
	}

	/**
	 *  Get excluded global remediation
	 *
	 * @param string $url
	 * @return array
	 */
	public static function get_excluded_remediations( string $url ) : array {
		$where = [
			[
				'column' => Exclude_Remediation_Relationship_Table::PAGE_URL,
				'value' => $url,
				'operator' => '=',
			],
		];

		$result = Exclude_Remediation_Relationship_Table::select( Exclude_Remediation_Relationship_Table::REMEDIATION_ID, $where );
		return wp_list_pluck( $result, Exclude_Remediation_Relationship_Table::REMEDIATION_ID );
	}

	/**
	 * Get all active remediations for a page (including global ones)
	 *
	 * @param string $url
	 * @return array
	 */
	public static function get_page_active_remediations( string $url ): array {
		// Base conditions for a specific page
		$page_where = [
			[
				'column' => Remediation_Table::URL,
				'value' => $url,
				'operator' => '=',
				'relation_after' => 'AND',
			],
			[
				'column' => Remediation_Table::ACTIVE,
				'value' => 1,
				'operator' => '=',
				'relation_after' => 'AND',
			],
			[
				'column' => Remediation_Table::GLOBAL,
				'value' => 1,
				'operator' => '<>',
			],
		];

		// Prepare conditions for global remediations
		$excluded = self::get_excluded_remediations( $url );

		$global_where = [
			[
				'column' => Remediation_Table::ACTIVE,
				'value' => 1,
				'operator' => '=',
				'relation_after' => 'AND',
			],
			[
				'column' => Remediation_Table::GLOBAL,
				'value' => 1,
				'operator' => '=',
			],
		];

		if ( ! empty( $excluded ) ) {
			$global_where[] = [
				'column' => Remediation_Table::ID,
				'value'  => $excluded,
				'operator' => 'NOT IN',
				'relation_before' => 'AND ',
			];
		}

		// Fetch results
		$page_remediations   = Remediation_Table::select( '*', $page_where );
		$global_remediations = Remediation_Table::select( '*', $global_where );

		return array_merge( $global_remediations, $page_remediations );
	}

	/**
	 * @param int $period
	 *
	 * @return array
	 */
	public static function get_all_remediations( int $period ) : array {
		$date_threshold = gmdate( 'Y-m-d', strtotime( "-{$period} days" ) ) . ' 00:00:00';

		$where = [
			[
				'column' => Remediation_Table::CREATED_AT,
				'value' => $date_threshold,
				'operator' => '>=',
			],
		];

		return Remediation_Table::select( '*', $where );
	}

	/**
	 * @param string $group
	 * @return array
	 */
	public static function get_global_remediation_group_ids( string $group ) : array {
		$where = [
			[
				'column' => Remediation_Table::GROUP,
				'value' => $group,
				'operator' => '=',
				'relation_after' => 'AND',
			],
			[
				'column' => Remediation_Table::GLOBAL,
				'value' => 1,
				'operator' => '=',
			],
		];

		return Remediation_Table::select( Remediation_Table::ID, $where );
	}

	/**
	 * @param string $by
	 * @param string $by_value
	 * @param bool $status
	 * @param string|null $group
	 *
	 * @return void
	 */
	public static function update_remediations_status( string $by, string $by_value, bool $status, ?string $group = null ): void {
		$where = $group ? [
			$by => $by_value,
			Remediation_Table::GROUP => $group,
			Remediation_Table::GLOBAL => 0,
		] : [
			$by => $by_value,
			Remediation_Table::GLOBAL => 0,
		];

		$data = [
			Remediation_Table::ACTIVE => $status,
		];

		Remediation_Table::update( $data, $where );
	}

	/**
	 * @param string $by
	 * @param string $by_value
	 * @param string $content
	 * @param bool $is_global
	 *
	 * @return void
	 */
	public static function update_remediation_content( string $by, string $by_value, string $content, bool $is_global ): void {
		$where = [
			$by => $by_value,
		];

		$data = [
			Remediation_Table::CONTENT => $content,
			Remediation_Table::GLOBAL => $is_global,
		];

		Remediation_Table::update( $data, $where );
	}
}
