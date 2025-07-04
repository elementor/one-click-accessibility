<?php

namespace EA11y\Modules\Scanner\Components;

use EA11y\Classes\Database\Exceptions\Missing_Table_Exception;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Page_Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class List_Column {
	public function get_name(): string {
		return 'list-column';
	}

	public function build_column() {
		$post_types = get_post_types( [ 'public' => true ], 'names' );
		$taxonomies = get_taxonomies( [ 'public' => true ], 'names' );
		foreach ( $post_types as $post_type ) {
			add_filter( "manage_{$post_type}_posts_columns", [ $this, 'add_accessibility_column' ] );
			add_action( "manage_{$post_type}_posts_custom_column", [ $this, 'render_accessibility_column_post' ], 10, 2 );
		}
		foreach ( $taxonomies as $taxonomy ) {
			add_filter( "manage_edit-{$taxonomy}_columns", [ $this, 'add_accessibility_column' ] );
			add_filter( "manage_{$taxonomy}_custom_column", [ $this, 'render_accessibility_column_tax' ], 10, 3 );
		}
	}

	public function add_accessibility_column( $columns ) {
		$columns['accessibility_status'] = '<img src="' . esc_url( EA11Y_ASSETS_URL . 'images/logo.svg' ) . '" alt="" style="width:16px; height:16px; vertical-align:text-bottom; margin-right:8px;" />' . esc_html__( 'Accessibility scans', 'pojo-accessibility' );
		return $columns;
	}

	public function render_accessibility_column_post( $column, $post_id ) {
		if ( 'accessibility_status' === $column ) {
			$url = get_permalink( $post_id );
			$this->render_column_accessibility( $url );
		}
	}

	public function render_accessibility_column_tax( $content, $column, $term_id ) {
		if ( 'accessibility_status' === $column ) {
			$url = get_term_link( $term_id );
			$this->render_column_accessibility( $url );
		}
		return $content;
	}

	private function get_current_page( string $url ): ?Page_Entry {
		try {
			return new Page_Entry( [
				'by' => Page_Table::URL,
				'value' => $url,
			] );
		} catch ( Missing_Table_Exception $e ) {
			return null;
		}
	}

	private function render_column_accessibility( string $url ) {
		$url_trimmed = rtrim( $url, '/' );
		$page = $this->get_current_page( $url_trimmed );
		$has_scan_data = $page->exists();
		$violation = $page->__get( Page_Table::VIOLATIONS );
		$resolved = $page->__get( Page_Table::RESOLVED );

		$passed = $has_scan_data && $resolved === $violation;

		$percentage = $violation > 0
			? round( ( $resolved / $violation ) * 100 )
			: '0';

		$level_class = $this->get_scan_level( $percentage );

		$separator = strpos( $url, '?' ) !== false ? '&' : '?';
		$assistant_url = esc_url( $url . $separator . 'open-ea11y-assistant=1&open-ea11y-assistant-src=WP' );

		/**
		 * Show the percentage of fixed violations or a checkmark if all violations are fixed.
		 */
		$chip = $passed
			? '<img src="' . esc_url( EA11Y_ASSETS_URL . 'images/check-passed.svg' ) . '" alt="" style="width:18px; height:18px;" />'
			: '<span class="accessibility_status_content__percentage ' . esc_html( $level_class ) . '">' . esc_html( $percentage ) . '%</span>';

		$no_scan_icon = '<img src="' . esc_url( EA11Y_ASSETS_URL . 'images/info.svg' ) . '" alt="" style="width:18px; height:18px;" />';

		/**
		 * Show the number of fixed and total violations or "Not scanned yet" if the page has not been scanned yet.
		 */
		$status_text = $has_scan_data ? esc_html( sprintf( __( '%1$s/%2$s fixed', 'pojo-accessibility' ), $resolved, $violation ) ) : esc_html__( 'Not scanned yet', 'pojo-accessibility' );

		$status_icon = $has_scan_data ? $chip : $no_scan_icon;

		$stats =
			'<div class="accessibility_status_content__stats">
				<div class="accessibility_status_content__summary">
					<span class="accessibility_status_content__text">' . $status_text . '</span>
					' . $status_icon . '
				</div>
				<div class="accessibility_status_content__bar">
					<div class="accessibility_status_content__bar-fill" style="width: ' . esc_attr( $percentage ) . '%;"></div>
				</div>
			</div>';

		$button_text = $has_scan_data ? esc_html__( 'Review fixes', 'pojo-accessibility' ) : esc_html__( 'Scan now', 'pojo-accessibility' );
		$button_text  = $passed ? esc_html__( 'New scan', 'pojo-accessibility' ) : $button_text;
		$button_class = $has_scan_data && ! $passed ? 'button' : 'button button-primary';
		$button_icon  = $passed
			? '<img src="' . esc_url( EA11Y_ASSETS_URL . 'images/refresh-scan.svg' ) . '" alt="" style="width:16px; height:16px; vertical-align:text-top; margin-left:8px;" />'
			: '';

		$scan_button = sprintf(
			'<a href="%1$s" class="%2$s" target="_blank" rel="noreferrer">%3$s%4$s</a>',
			$assistant_url,
			$button_class,
			$button_text,
			$button_icon
		);

		echo '<div class="accessibility_status_content">
			' . $stats . '
			<div class="accessibility_status_content__actions">' . $scan_button . '</div>
		</div>';
	}

	private function get_scan_level( int $percent ): ?string {
		switch ( true ) {
			case ( $percent >= 0 && $percent <= 25 ):
				return 'red';
			case ( $percent >= 26 && $percent <= 60 ):
				return 'orange';
			case ( $percent >= 61 ):
				return 'grey';
			default:
				return null;
		}
	}


	/**
	 * Component constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'build_column' ] );
	}
}
