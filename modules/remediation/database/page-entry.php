<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Classes\Database\Exceptions\Missing_Table_Exception;
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
	 * update_stats
	 *
	 * @param int $violations
	 * @return Page_Entry|null
	 */
	public function update_stats( int $violations ) : ?Page_Entry {
		if ( ! $this->entry_data[ Page_Table::VIOLATIONS ] ) {
			$this->entry_data[ Page_Table::VIOLATIONS ] = $violations;
			$this->entry_data[ Page_Table::RESOLVED ] = 0;
		} else {
			$resolved = $this->entry_data[ Page_Table::VIOLATIONS ] - $violations;
			if ( $resolved < 0 ) {
				$this->entry_data[ Page_Table::VIOLATIONS ] = $violations;
				$this->entry_data[ Page_Table::RESOLVED ] = 0;
			} else {
				$this->entry_data[ Page_Table::RESOLVED ] = $resolved;
			}
		}

		$this->save();

		return $this;
	}

	/**
	 * update_status
	 *
	 * @param string $status
	 * @return Page_Entry|null
	 */
	public function update_status( string $status ) : ?Page_Entry {
		if ( in_array( $status, Page_Table::STATUSES ) ) {
			$this->entry_data[ Page_Table::STATUS ] = $status;
			$this->save();

			return $this;
		}

		return null;
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

	public static function get_pages() : array {
		return Page_Table::select( '*', '1', 1000, null, '', [ Page_Table::CREATED_AT => 'desc' ] );
	}


	/**
	 * @throws Missing_Table_Exception
	 */
	public static function get_page_entry( $url ) {
		$page_entry = new Page_Entry( [
			'by' => Page_Table::URL,
			'value' => $url,
		] );
		if ( ! $page_entry->exists() ) {
			return false;
		}
		return $page_entry;
	}

	public static function clear_cache( string $url ) : void {
		try {
			$page = self::get_page_entry( $url );
			if ( $page ) {
				$page->__set( Page_Table::FULL_HTML, null );
				$page->save();
			}
		} catch ( Missing_Table_Exception $exception ) {
			return;
		}
	}

	public static function clear_all_cache() : void {
		$query = 'UPDATE `' . Page_Table::table_name() . '` SET `' . Page_Table::FULL_HTML . '` = NULL WHERE `' . Page_Table::FULL_HTML . '` IS NOT NULL';
		Page_Table::query( $query );
	}
}
