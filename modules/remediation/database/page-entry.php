<?php

namespace EA11y\Modules\Remediation\Database;

use EA11y\Classes\Database\Entry;
use EA11y\Classes\Logger;
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
	 * @var array $remediations holds array of remediation to preform on page
	 */
	private array $remediations;
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
	 *      the remediation is an array
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
		if ( empty( $this->hash ) ) {
			$this->hash = Utils::get_hash( $this->entry_data[ Page_Table::URL ] );
		}
		$this->entry_data[ Page_Table::REMEDIATIONS ] = (array) $this->entry_data[ Page_Table::REMEDIATIONS ];

		parent::create( $id );
	}

	/**
	 *  append_remediation
	 *
	 * @param array $remediation
	 *
	 * @return Page_Entry
	 */
	public function append_remediation( array $remediation ) : Page_Entry {
		$remediations = json_decode( $this->entry_data[ Page_Table::REMEDIATIONS ] );
		if ( ! is_array( $remediations ) ) {
			$remediations = [];
		}

		$remediations[] = $remediation;
		$this->entry_data[ Page_Table::REMEDIATIONS ] = wp_json_encode( $remediations );
		$this->save();

		return $this;
	}

	/**
	 *  get_remediation
	 *
	 * @return array $remediation
	 */
	public function get_remediations() : array {
		if ( key_exists( Page_Table::REMEDIATIONS, $this->entry_data ) ) {
			return json_decode( $this->entry_data[ Page_Table::REMEDIATIONS ], true );
		}
		return [];
	}

	public function to_json() : string {
		return wp_json_encode( $this->entry_data );
	}

}
