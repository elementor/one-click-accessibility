<?php

namespace EA11y\Modules\Scanner;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Scanner\Database\Scans_Table;
use EA11y\Modules\Settings\Classes\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'scanner';
	}

	public static function component_list(): array {
		return [
			'Top_Bar_Link',
		];
	}

	/**
	 * Get widget URL
	 * @return string
	 */
	public static function get_scanner_wizard_url() : string {
		return apply_filters( 'ea11y_scanner_wizard_url', 'https://cdn.elementor.com/a11y/scanner.js' );
	}

	public static function get_page_title() {
		global $post;
		if ( is_home() ) {
			$title = esc_html__( 'Blog', 'pojo-accessibility' );
		} elseif ( is_front_page() ) {
			$title = get_the_title( get_option( 'page_on_front' ) );
		} elseif ( is_category() ) {
			$title = single_cat_title( '', false );
		} elseif ( is_tag() ) {
			$title = single_tag_title( '', false );
		} elseif ( is_tax() ) {
			$term = get_queried_object();
			$title = $term->name ?? '';
		} elseif ( is_post_type_archive() ) {
			$title = post_type_archive_title( '', false );
		} elseif ( is_author() ) {
			$title = get_the_author();
		} elseif ( is_date() ) {
			$title = get_the_date();
		} elseif ( is_archive() ) {
			$title = get_the_archive_title();
		} else {
			$title = get_the_title( $post->ID );
		}

		return $title;
	}

	/**
	 * Enqueue Scripts
	 */
	public function enqueue_assets() : void {
		if ( is_admin() || ! is_admin_bar_showing() ) {
			return;
		}

		if ( version_compare( get_bloginfo( 'version' ), '6.6', '<' ) ) {
			wp_register_script(
				'react-jsx-runtime',
				EA11Y_ASSETS_URL . 'lib/react-jsx-runtime.js',
				[ 'react' ],
				'18.3.0',
				true
			);
		}

		wp_enqueue_style(
			'ea11y-ea11-scanner-wizard',
			EA11Y_ASSETS_URL . 'build/ea11y-scanner-wizard.css',
			[],
			EA11Y_VERSION
		);

		Utils\Assets::enqueue_app_assets( 'scanner', false );
		wp_localize_script(
			'scanner',
			'ea11yScannerData',
			[
				'wpRestNonce' => wp_create_nonce( 'wp_rest' ),
				'scannerUrl' => self::get_scanner_wizard_url(),
				'currentPageTitle' => self::get_page_title(),
				'planData' => Settings::get( Settings::PLAN_DATA ),
			]
		);
	}


	public function __construct() {
		Scans_Table::install();
		$this->register_components();

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets'] );
	}
}
