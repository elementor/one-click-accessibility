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
			$this->entry_data[ Page_Table::RESOLVED ] = $this->entry_data[ Page_Table::VIOLATIONS ] - $violations;
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

	public static function get_pages( int $period ) : array {
		$date_threshold = gmdate( 'Y-m-d H:i:s', strtotime( "-{$period} days" ) );

		$where = [
			[
				'column'   => Page_Table::CREATED_AT,
				'value'    => $date_threshold,
				'operator' => '>=',
			],
		];

		return Page_Table::select( '*', $where, null, null, '', [ Page_Table::CREATED_AT => 'desc' ] );
	}
}
