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
	 *  get_scan_result
	 * @param string $url
	 * @param bool $latest
	 *
	 * @return array
	 */
	public static function get_scan_result( string $url, bool $latest = false ) : array {
		$where = [
			[
				'column' => Scans_Table::URL,
				'value' => $url,
				'operator' => '=',
			],
		];
		$order_by = [ 'id' => $latest ? 'desc' : 'asc' ];
		$entries = Scans_Table::select( 'summary', $where, 1, null, '', $order_by );
		return isset( $entries[0] ) ? json_decode( $entries[0]->summary, true ) : [];
	}

	/**
	 *  get_scans
	 * @param string $url
	 * @param bool $latest
	 *
	 * @return array
	 */
	public static function get_scans( string $url, int $limit = 10 ) : array {
		$where = [
			[
				'column' => Scans_Table::URL,
				'value' => $url,
				'operator' => '=',
			],
		];

		$entries = Scans_Table::select( '*', $where, $limit, null, '', [ 'created_at' => 'desc' ] );

		return array_map( function ( $entry ) {
			$entry->summary = json_decode( $entry->summary, true );

			return $entry;
		}, $entries);
	}

	public static function get_by_id( int $id ) {
		$where = [
			[
				'column' => Scans_Table::ID,
				'value' => $id,
				'operator' => '=',
			],
		];

		$entries = Scans_Table::select( '*', $where, 1 );

		if ( isset( $entries[0] ) ) {
			$entries[0]->summary = json_decode( $entries[0]->summary, true );

			return $entries[0];
		}

		return null;
	}

	/**
	 * @param string $by
	 * @param string $by_value
	 * @param string $content
	 *
	 * @return void
	 */
	public static function update_scan_summary( string $by, string $by_value, string $content ): void {
		$where = [
			$by => $by_value,
		];

		$data = [
			Scans_Table::SUMMARY => $content,
		];

		Scans_Table::update( $data, $where );
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
