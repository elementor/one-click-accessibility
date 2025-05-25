<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Modules\Remediation\Classes\Utils;
use EA11y\Modules\Remediation\Exceptions\Missing_URL;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Page_Entry
 */
class Page_Entry extends Entry {
	/**
	 * @var string $hash holds md5 of page url
	 */
	private string $hash;

	public static function get_helper_class(): string {
		return Page_Table::get_class_name();
	}

	/**
	 * Create
	 *
	 * used to ensure:
	 *      the hash is set
	 *      URL is set
	 *
	 * @param string $id
	 *
	 * @throws Missing_URL
	 */
	public function create( string $id = 'id' ) {
		if ( empty( $this->entry_data[ Page_Table::URL ] ) ) {
			throw new Missing_URL();
		}
		$date_time = gmdate( 'Y-m-d H:i:s' );
		$this->entry_data[ Page_Table::CREATED_AT ] = $date_time;
		$this->entry_data[ Page_Table::UPDATED_AT ] = $date_time;

		parent::create( $id );
	}

	/**
	 * update_html
	 *
	 * @param string $html
	 * @return Page_Entry|null
	 */
	public function update_html( string $html ) : ?Page_Entry {
		if ( ! $html ) {
			return null;
		}

		$this->entry_data[ Page_Table::HASH ] = Utils::get_hash( $this->entry_data[ Page_Table::UPDATED_AT ] );
		$this->entry_data[ Page_Table::FULL_HTML ] = $html;

		$this->save();

		return $this;
	}

	/**
	 *  get_page_data
	 *
	 * @return string $html
	 */
	public function get_page_html() : ?string {
		return key_exists( Page_Table::FULL_HTML, $this->entry_data )
			? $this->entry_data[ Page_Table::FULL_HTML ]
			: '';
	}

	/**
	 *  is_valid_hash
	 *
	 * @return bool
	 */
	public function is_valid_hash() : bool {
		$current_hash = Utils::get_hash( $this->entry_data[ Page_Table::UPDATED_AT ] );
		return ! empty( $this->entry_data[ Page_Table::HASH ] ) && $this->entry_data[ Page_Table::HASH ] === $current_hash;
	}

	public function to_json() : string {
		return wp_json_encode( $this->entry_data );
	}

}
