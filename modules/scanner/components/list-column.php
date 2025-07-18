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
				$button_class = 'button';
				$button_style = 'color: #B91C1C; border-color: #B91C1C;';
			} else {
				$button_text = esc_html__( 'Scan now', 'pojo-accessibility' );
				$button_class = 'button button-primary';
				$button_style = '';
			}

			$content = sprintf(
				'<a href="%1$s" class="%2$s" target="_blank" rel="noreferrer" style="%4$s">%3$s</a>',
				$assistant_url,
				$button_class,
				$button_text,
				$button_style
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
	}
}
