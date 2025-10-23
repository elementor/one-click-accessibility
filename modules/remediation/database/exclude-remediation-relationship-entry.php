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
class Exclude_Remediation_Relationship_Entry extends Entry {
	public static function get_helper_class(): string {
		return Exclude_Remediation_Relationship_Table::get_class_name();
	}

	/**
	 * Create
	 *
	 * @param string $id
	 *
	 * @throws Missing_URL
	 */
	public function create( string $id = 'id' ) {
		if ( empty( $this->entry_data[ Exclude_Remediation_Relationship_Table::PAGE_URL ] ) ) {
			throw new Missing_URL();
		}

		parent::create( $id );
	}

	/**
	 * Remove
	 *
	 * @param string $page_url
	 * @param string $remediation_id
	 */
	public static function remove( string $page_url, string $remediation_id ) {
		$where = [
			Exclude_Remediation_Relationship_Table::PAGE_URL => $page_url,
			Exclude_Remediation_Relationship_Table::REMEDIATION_ID => $remediation_id,
		];
		Exclude_Remediation_Relationship_Table::delete( $where );
	}
}
