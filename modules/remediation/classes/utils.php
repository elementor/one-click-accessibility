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
}
