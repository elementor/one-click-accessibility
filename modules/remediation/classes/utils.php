<?php

namespace EA11y\Modules\Remediation\Classes;

class Utils {
	/**
	 * get current page url
	 */
	public static function get_current_page_url(): ?string {
		global $wp;
		return home_url( $wp->request );
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
				return 'post';
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
			return $wp_query->query_vars['post_type'] ?? 'unknown';
		}

		if ( $wp_query->is_singular() ) {
			return get_post_type() ?? 'unknown';
		}

		return 'unknown';
	}

	public static function get_current_page_hash() : string {
		return self::get_hash( self::get_current_page_url() );
	}

	public static function get_hash( $url ) : string {
		return md5( $url );
	}

	public static function sanitize_object_for_sql_json( $input ) {
		// Convert object to array if needed
		if ( is_object( $input ) ) {
			$input = (array) $input;
		}

		// Recursively sanitize
		array_walk_recursive($input, function ( &$value ) {
			if ( is_string( $value ) ) {
				$value = sanitize_text_field( $value );
			}
		});

		return $input;
	}

	public static function get_current_url(): string {
		$host = isset( $_SERVER['HTTP_HOST'] ) ? wp_unslash( $_SERVER['HTTP_HOST'] ) : '';
		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
		$protocol    = is_ssl() ? 'https://' : 'http://';

		return esc_url_raw( $protocol . $host . $request_uri );
	}


}
