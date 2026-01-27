<?php

namespace EA11y\Modules\Scanner\Classes;

use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Scanner\Database\Scan_Entry;
use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Utils {
	/**
	 * @throws Exception
	 */
	public static function create_tmp_file_from_png_base64( $base64_string ): string {
		// Check if the base64 string starts with 'data:image/png;base64,'
		if ( preg_match( '/^data:image\/png;base64,(.+)$/', $base64_string, $matches ) ) {
			$base64_data = $matches[1];
		} else {
			throw new Exception( 'Invalid base64 PNG format' );
		}

		// Decode the base64 data
		$image_data = base64_decode( $base64_data );

		if ( false === $image_data ) {
			throw new Exception( 'Failed to decode base64 PNG' );
		}

		// Save the image to a temporary file
		$tmp_path = tempnam( sys_get_temp_dir(), 'png_' ) . '.png';
		file_put_contents( $tmp_path, $image_data );

		return $tmp_path;
	}

	public static function get_scanner_stats(  ): array{
		$output = [
			'pages' => 0,
			'issues_total' => 0,
			'issues_fixed' => 0,
		];

		$pages_scanned = Page_Entry::get_pages();


		foreach ( $pages_scanned as $page ) {
			$scans = Scan_Entry::get_scans( $page->url, 1);
			$remediation_count = Remediation_Entry::get_page_remediations_count($page->url);

			if ( count( $scans ) > 0 ) {
				$output['issues_total'] += $scans[0]->summary['counts']['violation'] ?? 0;
				$output['issues_fixed'] += $remediation_count;
			}
		}

		$output['pages'] = count( $pages_scanned );

		return $output;
	}
}
