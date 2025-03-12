<?php

namespace EA11y\Modules\Scanner\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Modules\Scanner\exceptions\Missing_Page_Id;

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
	 * Create
	 * used to ensure:
	 *      the remediation is an array
	 *      the hash is set
	 *      URL is set
	 *
	 * @param string $id
	 *
	 * @throws Missing_Page_Id
	 */
	public function create( string $id = 'id' ) {
		if ( empty( $this->entry_data[ page::URL ] ) ) {
			throw new Missing_Page_Id();
		}

		parent::create( $id );
	}
}
