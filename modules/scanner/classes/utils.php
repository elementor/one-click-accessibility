<?php

namespace EA11y\Modules\Scanner\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Utils {
	public static function sanitize_base64_image( $data_url ) {
		// Match base64 image data URI with MIME type
		if ( ! preg_match( '/^data:(image\/(png|jpeg|gif|webp|svg\+xml));base64,/', $data_url, $matches ) ) {
			return false;
		}

		$mime_type = $matches[1];
		$base64_data = substr( $data_url, strpos( $data_url, ',' ) + 1 );
		$decoded_data = base64_decode( $base64_data, true );

		if ( false === $decoded_data ) {
			return false; // Not valid base64
		}

		// Special handling for SVG
		if ( strpos( $mime_type, 'svg' ) !== false ) {
			// Load as XML and remove scripts/styles
			libxml_use_internal_errors( true );
			$xml = simplexml_load_string( $decoded_data, 'SimpleXMLElement', LIBXML_NOENT | LIBXML_NOCDATA | LIBXML_NONET );
			if ( ! $xml ) {
				return false;
			}

			$svg_string = $xml->asXML();

			// Basic cleaning: remove scripts and on* attributes
			$svg_string = preg_replace( '/<script.*?>.*?<\/script>/is', '', $svg_string );
			$svg_string = preg_replace( '/on\w+=".*?"/is', '', $svg_string );

			// Re-encode cleaned SVG
			$safe_svg_base64 = base64_encode( $svg_string );
			return 'data:image/svg+xml;base64,' . $safe_svg_base64;
		}

		return $data_url; // Valid base64 image
	}

}
