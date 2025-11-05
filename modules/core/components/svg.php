<?php

namespace EA11y\Modules\Core\Components;

use EA11y\Modules\Core\Classes\Svg_Sanitizer;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Svg
 * @since 3.3.0
 * @package EA11y\Modules\Core\Svg
 */
class Svg {
	const UNFILTERED_FILE_UPLOADS_KEY = 'ea11y_unfiltered_files_upload';

	public function __construct() {
		add_filter( 'wp_handle_upload_prefilter', [ $this, 'handle_ea11y_wp_media_upload' ] );
		add_filter( 'upload_mimes', [ $this, 'add_svg_to_upload_list' ] );
	}

	/**
	* Get Mime Type
	*
	* Returns the file type's mime type
	*
	* @access public
	*
	* @return string mime type
	*/
	public function get_mime_type(): string {
		return 'image/svg+xml';
	}

	/**
	* Is Unfiltered Uploads Enabled?
	*
	* @access public
	*
	* @return bool
	*/
	public static function are_unfiltered_uploads_enabled(): bool {
		$enabled = (bool) get_option( self::UNFILTERED_FILE_UPLOADS_KEY );

		/**
		* Allow Unfiltered Files Upload.
		*
		* Determines whether to enable unfiltered file uploads.
		*
		* @param bool $enabled Whether upload is enabled or not.
		*/
		return apply_filters( 'ea11y/files/allow_unfiltered_upload', $enabled );
	}

	/**
	* Handle EA11Y WP Media Upload
	*
	* Runs on the 'wp_handle_upload_prefilter' filter.
	*
	* @access public
	*
	* @param $file
	* @return mixed
	*/
	public function handle_ea11y_wp_media_upload( $file ) {

		if ( ! self::are_unfiltered_uploads_enabled() ) {
			return $file;
		}

		// Check if the request is from EA11Y
		if ( ! $this->is_ea11y_wp_media_upload() ) {
			return $file;
		}

		$result = $this->validate_file( $file );

		if ( is_wp_error( $result ) ) {
			$file['error'] = $result->get_error_message();
		}

		return $file;
	}

	/**
	* @param  $mimes
	* @return mixed
	*/
	public function add_svg_to_upload_list ($mimes) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $mimes;
		}

		if ( ! self::are_unfiltered_uploads_enabled() ) {
			return $mimes;
		}

		$mimes['svg'] = $this->get_mime_type();

		return $mimes;
	}

	/**
	* Sanitize SVG
	*
	* @access public
	*
	* @param $filename
	* @return bool
	*/
	public function sanitize_svg( $filename ): bool {
		return ( new SVG_Sanitizer() )->sanitize_file( $filename );
	}

	/**
	* Is EA11Y WP Media Upload
	*
	* Checks whether the current request is a request to upload files into the WP Media Library via EA11Y.
	*
	* @access private
	*
	* @return bool
	*/
	private function is_ea11y_wp_media_upload() : bool {
		return isset( $_REQUEST['upload_source'] ) && 'ea11y-custom-icon' === $_REQUEST['upload_source'];
	}

	/**
	* Check if the mime type for the uploaded file is allowed in the WordPress upload list.
	*
	* @param $file_mime_type
	* @return bool
	*/
	private function is_file_type_allowed($file_mime_type): bool {
		$allowed_file_types = get_allowed_mime_types();

		// Check if the file type is allowed
		foreach ($allowed_file_types as $key => $value) {
			if (strpos($value, $file_mime_type) !== false) {
				return true;
			}
		}

		return false;
	}

	/**
	* Validate File
	*
	* @access public
	*
	* @param $file
	* @return bool|\WP_Error
	*/
	public function validate_file( $file ) {

		if ( ! $this->is_file_type_allowed($file['type'])) {
			return new \WP_Error( 403, 'Uploading this file type is not allowed.' );
		}

		if ( ! $this->sanitize_svg( $file['tmp_name'] ) ) {
			return new \WP_Error( 403, esc_html__( 'This file is not allowed for security reasons.', 'pojo-accessibility' ) );
		}

		return true;
	}
}
