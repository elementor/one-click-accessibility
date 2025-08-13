<?php

namespace EA11y\Modules\Remediation\Components;

use EA11y\Modules\Remediation\Database\Page_Entry;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Cache_Cleaner
 */
class Cache_Cleaner {
	const EA11Y_CLEAR_POST_CACHE_HOOK = 'ea11y_clear_post_cache';

	public static function clear_ally_cache() : void {
		Page_Entry::clear_all_cache();
	}

	public static function clear_ally_post_cache( $post ) : void {
		$url = get_permalink( $post->ID );
		$url_trimmed = rtrim( $url, '/' );
		Page_Entry::clear_cache( $url_trimmed );
	}

	public static function clear_ally_url_cache( $url ) : void {
		$url_trimmed = rtrim( $url, '/' );
		Page_Entry::clear_cache( $url_trimmed );
	}

	public static function clear_ally_list_cache( $urls ) : void {
		foreach ( $urls as $url ) {
			$url_trimmed = rtrim( $url, '/' );
			Page_Entry::clear_cache( $url_trimmed );
		}
	}

	public function add_wp_rocket_clean_action() {
		add_action( 'rocket_after_clean_domain', [ self::class, 'clear_ally_cache' ] );
		add_action( 'rocket_after_clean_terms', [ self::class, 'clear_ally_list_cache' ] );
		add_action( 'after_rocket_clean_post', [ self::class, 'clear_ally_post_cache' ] );
		add_action( 'after_rocket_clean_home', [ self::class, 'clear_ally_url_cache' ] );
		add_action( 'after_rocket_clean_file', [ self::class, 'clear_ally_url_cache' ] );
	}

	public function add_litespeed_clean_hook() {
		add_filter( 'litespeed_purge_post_events', function ( $events ) {
			$events[] = self::EA11Y_CLEAR_POST_CACHE_HOOK;
			return $events;
		} );
	}

	public function clean_taxonomy_cache( $term_id, $tt_id, $taxonomy ) {
		// Only for public taxonomies
		if ( ! in_array( $taxonomy, get_taxonomies( [ 'public' => true ] ), true ) ) {
			return;
		}

		$term = get_term( $term_id, $taxonomy );
		$term_url = get_term_link( $term );

		if ( is_wp_error( $term_url ) ) {
			return;
		}

		$url_trimmed = rtrim( $term_url, '/' );
		Page_Entry::clear_cache( $url_trimmed );
	}

	public function clean_post_cache( $post_ID, $post, $update ) {
		// Only on publish post for public post type
		$post_type_object = get_post_type_object( $post->post_type );
		if (
			( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ||
			( ! $post_type_object || ! $post_type_object->public ) ||
			'publish' !== $post->post_status
		) {
			return;
		}

		$post_url = get_permalink( $post_ID );
		$url_trimmed = rtrim( $post_url, '/' );
		Page_Entry::clear_cache( $url_trimmed );
	}

	public function __construct() {
		$this->add_litespeed_clean_hook();
		$this->add_wp_rocket_clean_action();

		add_action( 'created_term', [ $this, 'clean_taxonomy_cache' ], 10, 3 );
		add_action( 'edited_term', [ $this, 'clean_taxonomy_cache' ], 10, 3 );
		add_action( 'save_post', [ $this, 'clean_post_cache' ], 10, 3 );
	}
}
