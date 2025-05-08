<?php

namespace EA11y\Modules\Scanner\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Modules\Remediation\Exceptions\Missing_URL;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Scan_Entry
 */
class Scan_Entry extends Entry {

	public static function get_helper_class(): string {
		return Scans_Table::get_class_name();
	}

	/**
	 *  add_record
	 * @param string $url
	 * @param array $summary
	 *
	 * @return Scan_Entry
	 */
	public function add_record( string $url, array $summary ) : Scan_Entry {

		$this->entry_data[ Scans_Table::URL ] = $url;
		$this->entry_data[ Scans_Table::SUMMARY ] = wp_json_encode( $summary );
		$this->save();

		return $this;
	}

	/**
	 * Create
	 * used to ensure:
	 *      the remediation is an array
	 *      the hash is set
	 *      URL is set
	 *
	 * @param string $id
	 *
	 * @throws Missing_URL
	 */
	public function create( string $id = 'id' ) {
		if ( empty( $this->entry_data[ Scans_Table::URL ] ) ) {
			throw new Missing_URL();
		}

		parent::create( $id );
	}
}
