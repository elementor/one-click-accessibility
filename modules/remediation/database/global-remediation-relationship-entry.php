<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Classes\Database\Exceptions\Missing_Table_Exception;
use EA11y\Modules\Remediation\Exceptions\Missing_URL;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Page_Entry
 */
class Global_Remediation_Relationship_Entry extends Entry {
	public static function get_helper_class(): string {
		return Global_Remediation_Relationship_Table::get_class_name();
	}

	/**
	 * Create
	 *
	 * @param string $id
	 *
	 * @throws Missing_URL
	 */
	public function create( string $id = 'id' ) {
		if ( empty( $this->entry_data[ Global_Remediation_Relationship_Table::PAGE_URL ] ) ) {
			throw new Missing_URL();
		}

		parent::create( $id );
	}

	/**
	 * get_relationship_entry
	 * @param string $page_url
	 * @param string $remediation_id
	 * @return Global_Remediation_Relationship_Entry
	 * @throws Missing_Table_Exception
	 */
	public static function get_relationship_entry( $page_url, $remediation_id ): Global_Remediation_Relationship_Entry {
		return new Global_Remediation_Relationship_Entry([
			'by' => '',
			'value' => [
				[
					'column' => Global_Remediation_Relationship_Table::PAGE_URL,
					'value' => $page_url,
					'operator' => '=',
					'relation_after' => 'AND',
				],
				[
					'column' => Global_Remediation_Relationship_Table::REMEDIATION_ID,
					'value' => $remediation_id,
					'operator' => '=',
				],
			],
		]);
	}

	/**
	 * Remove
	 *
	 * @param string $page_url
	 * @param string $remediation_id
	 */
	public static function remove( string $page_url, string $remediation_id ) {
		$where = [
			Global_Remediation_Relationship_Table::PAGE_URL => $page_url,
			Global_Remediation_Relationship_Table::REMEDIATION_ID => $remediation_id,
		];
		Global_Remediation_Relationship_Table::delete( $where );
	}

	/**
	 * Update Status
	 *
	 * @param string $page_url
	 * @param string $remediation_id
	 * @param bool $status
	 */
	public function update_status( string $page_url, string $remediation_id, bool $status ) {
		if ( ! $this->exists() ) {
			unset( $this->entry_data[ Global_Remediation_Relationship_Table::ID ] );
		}
		$this->entry_data[ Global_Remediation_Relationship_Table::PAGE_URL ] = $page_url;
		$this->entry_data[ Global_Remediation_Relationship_Table::REMEDIATION_ID ] = $remediation_id;
		$this->entry_data[ Global_Remediation_Relationship_Table::ACTIVE ] = $status;
		$this->save();
	}

	/**
	 * Update Status for all pages
	 *
	 * @param string $remediation_id
	 * @param bool $status
	 */
	public static function update_status_for_all_pages( string $remediation_id, bool $status ) {
		$where = [
			Global_Remediation_Relationship_Table::REMEDIATION_ID => $remediation_id,
		];
		$data = [
			Global_Remediation_Relationship_Table::ACTIVE => $status,
		];
		Global_Remediation_Relationship_Table::update( $data, $where );
	}
}
