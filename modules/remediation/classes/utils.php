<?php

namespace EA11y\Modules\Remediation\Classes;

use EA11y\Modules\Remediation\Components\Cache_Cleaner;
use WP_Post;

class Utils {
	/**
	 * get current page url
	 */
	public static function get_current_page_url(): ?string {
		global $post;
		if ( self::is_draft( $post ) ) {
			return self::build_draft_url( $post );
		}
		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
		$path = wp_parse_url( $request_uri, PHP_URL_PATH ); // removes query string
		return rtrim( home_url( $path ), '/' );
	}

	public static function is_draft( $post ): bool {
		return $post instanceof WP_Post && in_array( $post->post_status, [ 'draft', 'pending', 'auto-draft' ], true );
	}

	public static function build_draft_url( $post ): string {
		$my_post = clone $post;
		$my_post->post_status = 'publish';
		$my_post->post_name = sanitize_title(
			$my_post->post_name ? $my_post->post_name : $my_post->post_title,
			$my_post->ID
		);
		return rtrim( get_permalink( $my_post ), '/' );
	}


	public static function get_current_page_title() {
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

	public static function get_current_object_id(): int {
		global $wp_query;
		return $wp_query->get_queried_object_id();
	}

	public static function get_current_object_type() : string {
		global $wp_query;

		if ( $wp_query->is_archive() ) {
			if ( $wp_query->is_post_type_archive() ) {
				return 'post_type';
			} elseif ( $wp_query->is_author() ) {
				return 'user';
			} elseif ( $wp_query->is_category() || $wp_query->is_tag() || $wp_query->is_tax() ) {
				return 'taxonomy';
			} elseif ( $wp_query->is_date() ) {
				return 'date';
			} else {
				return 'archive';
			}
		}

		if ( $wp_query->is_search() ) {
			return 'search';
		}

		if ( $wp_query->is_singular() ) {
			if ( $wp_query->is_single() ) {
				return get_post_type( $wp_query->get_queried_object_id() ) ?? 'unknown';
			} elseif ( $wp_query->is_page() ) {
				return 'page';
			} elseif ( $wp_query->is_attachment() ) {
				return 'attachment';
			} elseif ( $wp_query->is_404() ) {
				return '404';
			} else {
				return 'singular';
			}
		}

		if ( $wp_query->is_home() ) {
			return 'home';
		}

		if ( $wp_query->is_front_page() ) {
			return 'front_page';
		}

		return 'unknown';
	}

	public static function get_current_object_type_name() : string {
		global $wp_query;

		if ( $wp_query->is_category() || $wp_query->is_tag() || $wp_query->is_tax() ) {
			$term = $wp_query->get_queried_object();
			return $term->taxonomy ?? 'unknown';
		}

		if ( $wp_query->is_post_type_archive() ) {
			$post_type = $wp_query->query_vars['post_type'];
			if ( is_array( $post_type ) ) {
				$post_type = implode( '_', $post_type );
			}
			return $post_type ?? 'unknown';
		}

		if ( $wp_query->is_singular() ) {
			return get_post_type() ?? 'unknown';
		}

		return 'unknown';
	}

	public static function get_hash( $text ) : string {
		return md5( $text );
	}

	public static function trigger_save_for_clean_cache( $entry_id, $entry_type ): void {
		$entry_id = (int) $entry_id;
		$post_types = get_post_types([
			'public' => true,
		], 'names');

		if (
			! is_numeric( $entry_id ) ||
			intval( $entry_id ) <= 0 ||
			! in_array( $entry_type, array_merge( [ 'taxonomy' ], $post_types ), true )
		) {
			return;
		}

		if ( in_array( $entry_type, $post_types, true ) ) {
			$post = get_post( $entry_id );
			if ( $post && is_object( $post ) && 'publish' === $post->post_status ) {
				do_action( Cache_Cleaner::EA11Y_CLEAR_POST_CACHE_HOOK, $entry_id, $post );
				do_action( 'save_post', $entry_id, $post, true );
			}
		}
		if ( 'taxonomy' === $entry_type ) {
			$term = get_term( $entry_id );

			if ( is_wp_error( $term ) || ! $term ) {
				return;
			}

			$taxonomy = $term->taxonomy;
			$tt_id = $term->term_taxonomy_id;

			do_action( 'edited_term', $entry_id, $tt_id, $taxonomy );
		}
	}
}
