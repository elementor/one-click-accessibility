<?php

namespace EA11y\Modules\Scanner\Components;

use EA11y\Modules\Remediation\Database\Remediation_Entry;
use EA11y\Modules\Scanner\Database\Scan_Entry;

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
		$columns['accessibility_status'] = '<img src="' . esc_url( EA11Y_ASSETS_URL . 'images/logo.svg' ) . '" alt="" style="width:16px; height:16px; vertical-align:text-bottom; margin-right:8px;" />' . esc_html__( 'Accessibility status', 'pojo-accessibility' );
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

	private function render_column_accessibility( string $url ) {
		$url_trimmed = rtrim( $url, '/' );
		$initial_scanner_results = Scan_Entry::get_initial_scan_result( $url_trimmed );
		$violation = $initial_scanner_results['counts']['violation'] ?? 0;
		$count = Remediation_Entry::get_page_remediations( $url_trimmed, true );
		$resolved = $count[0]->total;
		$stats = ! ! $initial_scanner_results['counts'] ? '
			<div style="display: flex; gap: 6px; flex-direction: column; flex-grow: 3;">
				<div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
					<span>' . esc_html( sprintf( __( '%1$s/%2$s fixed', 'pojo-accessibility' ), $resolved, $violation ) ) . '</span>
					<span style="background-color: #e2e3e5; color: #000; font-weight: 600; border-radius: 12px; padding: 2px 6px;">63%</span>
				</div>
				<div style="background-color: #e2e3e5; height: 6px; border-radius: 3px; overflow: hidden;">
					<div style="background-color: #555; width: 63%; height: 100%;"></div>
				</div>
			</div>
		' : '—';
		$scan_button = ! ! $initial_scanner_results['counts'] ? '
			<a href="' . esc_url( $url ) . '?open-ea11y-assistant=1" class="button button-primary">' . esc_html__( 'Resolve issues', 'pojo-accessibility' ) . '</a>
		' : '
			<a href="' . esc_url( $url ) . '?open-ea11y-assistant=1" class="button">' . esc_html__( 'Scan page', 'pojo-accessibility' ) . '</a>
		';

		echo '
			<div style="display: flex; gap: 16px; justify-content: space-between; width: 350px; align-items: center;">
				' . $stats . '
				<div>
					' . $scan_button . '
				</div>
			</div>
		';
	}

	/**
	 * Component constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'build_column' ] );
	}
}
