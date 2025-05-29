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
	 * @param string $id
	 */
	public static function remove( string $id ) {
		$where = [
			[
				'column' => Remediation_Table::ID,
				'value' => $id,
				'operator' => '=',
			],
		];
		Remediation_Table::delete( $where );
	}


	/**
	 *  get_page_remediations
	 *
	 * @param string $url
	 * @param bool $total
	 * @return array
	 */
	public static function get_page_remediations( string $url, bool $total = false ) : array {
		$where = [
			[
				'column' => Remediation_Table::URL,
				'value' => $url,
				'operator' => '=',
			],
		];
		$select = $total ? 'COUNT(*) as total' : '*';
		return Remediation_Table::select( $select, $where );
	}


}
