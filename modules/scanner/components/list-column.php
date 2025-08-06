<?php

namespace EA11y\Modules\Scanner\Components;

use EA11y\Classes\Database\Exceptions\Missing_Table_Exception;
use EA11y\Modules\Remediation\Classes\Utils;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Page_Table;
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
		$columns['accessibility_status'] = '<a class="ea11y-tooltip ea11y-tooltip-n ea11y-tooltip-hidden" data-label="' . esc_attr__( 'Ally', 'pojo-accessibility' ) . '"><img src="' . esc_url( EA11Y_ASSETS_URL . 'images/logo.svg' ) . '" alt="" style="width:20px; height:20px; vertical-align:middle; margin-right:8px;" /></a><span class="ea11y-column-title" title="' . esc_attr__( 'Ally', 'pojo-accessibility' ) . '">' . esc_html__( 'Ally', 'pojo-accessibility' ) . '</span>';
		return $columns;
	}

	public function render_accessibility_column_post( $column, $post_id ) {
		if ( 'accessibility_status' === $column ) {
			$post = get_post( $post_id );
			$url = in_array( $post->post_status, [ 'draft', 'pending', 'auto-draft' ], true )
				? Utils::build_draft_url( $post )
				: get_permalink( $post_id );
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
		$latest_scan = Scan_Entry::get_scan_result( $url_trimmed, true );

		if ( empty( $latest_scan ) ) {
			$latest_scan = [
				'counts' => [
					'violation' => 0,
					'issuesResolved' => 0,
				],
			];
		}

		$violation = $latest_scan['counts']['violation'];
		$resolved = $latest_scan['counts']['issuesResolved'];

		$passed = $has_scan_data && $resolved === $violation;

		$separator = strpos( $url, '?' ) !== false ? '&' : '?';
		$assistant_url = esc_url( $url . $separator . 'open-ea11y-assistant=1&open-ea11y-assistant-src=WP' );

		if ( $passed ) {
			$content = '<img src="' . esc_url( EA11Y_ASSETS_URL . 'images/check-icon.svg' ) . '" alt="' . esc_attr__( 'All accessibility issues resolved', 'pojo-accessibility' ) . '" style="width:24px; height:24px;" />';
		} else {
			if ( $has_scan_data ) {
				$issues_left = $violation - $resolved;
				$button_text = sprintf(
					/* translators: %d: number of issues to fix */
					_n( 'Fix %d issue', 'Fix %d issues', $issues_left, 'pojo-accessibility' ),
					$issues_left
				);
				$tooltip_text = sprintf(
					/* translators: %d: number of issues to fix */
					_n( 'Fix %d issue', 'Fix %d issues', $issues_left, 'pojo-accessibility' ),
					$issues_left
				);
				$button_class = 'button ea11y-accessibility-button';
				$button_style = 'color: #B91C1C; border-color: #B91C1C;';
				$short_text = esc_html__( 'Fix', 'pojo-accessibility' );
			} else {
				$button_text = esc_html__( 'Scan URL', 'pojo-accessibility' );
				$tooltip_text = esc_html__( 'Scan URL', 'pojo-accessibility' );
				$button_class = 'button button-primary ea11y-accessibility-button';
				$button_style = '';
				$short_text = esc_html__( 'Scan', 'pojo-accessibility' );
			}

			$content = sprintf(
				'<a href="%1$s" class="%2$s ea11y-tooltip ea11y-tooltip-n" target="_blank" rel="noreferrer" style="%3$s" data-full-text="%4$s" data-short-text="%5$s" data-label="%6$s"><span class="ea11y-button-text">%7$s</span></a>',
				$assistant_url,
				$button_class,
				$button_style,
				esc_attr( $button_text ),
				esc_attr( $short_text ),
				esc_attr( $tooltip_text ),
				$button_text
			);
		}

		echo '<div class="accessibility_status_content">
			<div class="accessibility_status_content__actions">' . $content . '</div>
		</div>';
	}

	/**
	 * Component constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'build_column' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Enqueue assets for the accessibility column enhancements.
	 */
	public function enqueue_assets() {
		$screen = get_current_screen();

		// Only load on edit.php pages (post list tables) and edit-tags.php (taxonomy list tables)
		if ( ! $screen || ! in_array( $screen->base, [ 'edit', 'edit-tags' ], true ) ) {
			return;
		}

		// Enqueue JavaScript
		wp_enqueue_script(
			'ea11y-list-column',
			EA11Y_URL . 'modules/scanner/assets/js/list-column.js',
			[],
			EA11Y_VERSION,
			true
		);

		// CSS is now included in the main ea11y-scanner-admin.scss file
	}
}
