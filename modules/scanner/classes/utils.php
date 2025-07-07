<?php

namespace EA11y\Modules\Scanner\Classes;

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
}
