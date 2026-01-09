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

	public static function clear_ally_cache(): void {
		Page_Entry::clear_all_cache();
	}

	public static function clear_ally_post_cache( $post ): void {
		$url = get_permalink( $post->ID ?? $post );
		$url_trimmed = rtrim( $url, '/' );
		Page_Entry::clear_cache( $url_trimmed );
	}

	public static function clear_ally_url_cache( $url ): void {
		$url_trimmed = rtrim( $url, '/' );
		Page_Entry::clear_cache( $url_trimmed );
	}

	public static function clear_ally_list_cache( $urls ): void {
		foreach ( $urls as $url ) {
			$url_trimmed = rtrim( $url, '/' );
			Page_Entry::clear_cache( $url_trimmed );
		}
	}

	public function add_cache_plugins_clean_actions() {
		// WP Rocket
		$this->add_wp_rocket_clean_action();

		// W3 Total Cache
		$this->add_w3tc_clean_action();

		// LiteSpeed
		$this->add_litespeed_clean_actions();

		// FlyingPress
		$this->add_flying_press_clean_action();

		// Swift Performance
		$this->add_swift_performance_clean_action();

		// WP-Optimize
		$this->add_wp_optimize_clean_action();

		// Breeze
		$this->add_breeze_clean_action();

		// NitroPack
		$this->add_nitro_pack_clean_action();

		// WP Super Cache
		$this->add_wp_super_cache_clean_action();

		// Super Page Cache for Cloudflare
		$this->add_swcfpc_clean_action();

		// WP Cloudflare Cache
		$this->add_wpcc_clean_action();

		// App for Cloudflare®
		$this->add_afcf_clean_action();

		// Hosting cache (WPEngine, Kinsta)

	}

	public function add_wp_rocket_clean_action() {
		add_action( 'rocket_after_clean_domain', [ self::class, 'clear_ally_cache' ] );
		add_action( 'rocket_after_clean_terms', [ self::class, 'clear_ally_list_cache' ] );
		add_action( 'after_rocket_clean_post', [ self::class, 'clear_ally_post_cache' ] );
		add_action( 'after_rocket_clean_home', [ self::class, 'clear_ally_url_cache' ] );
		add_action( 'after_rocket_clean_file', [ self::class, 'clear_ally_url_cache' ] );
	}

	public function add_w3tc_clean_action() {
		add_action( 'w3tc_flush_all', [ self::class, 'clear_ally_cache' ] );
		add_action( 'w3tc_flush_post', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_litespeed_clean_actions() {
		add_action( 'litespeed_purged_all', [ self::class, 'clear_ally_cache' ] );
		add_action( 'litespeed_purged_post', [ self::class, 'clear_ally_post_cache' ] );

		add_filter('litespeed_purge_post_events', function ( $events ) {
			$events[] = self::EA11Y_CLEAR_POST_CACHE_HOOK;
			return $events;
		});
	}

	public function add_flying_press_clean_action() {
		add_action( 'flying_press_purged_all', [ self::class, 'clear_ally_cache' ] );
		add_action( 'flying_press_purged_post', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_swift_performance_clean_action() {
		add_action( 'swift_performance_after_clear_all_cache', [ self::class, 'clear_ally_cache' ] );
		add_action( 'swift_performance_after_clear_post_cache', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_wp_optimize_clean_action() {
		add_action( 'wpo_cache_cleared', [ self::class, 'clear_ally_cache' ] );
		add_action( 'wpo_purge_post_cache', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_breeze_clean_action() {
		add_action( 'breeze_clear_all_cache', [ self::class, 'clear_ally_cache' ] );
		add_action( 'breeze_clear_post_cache', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_nitro_pack_clean_action() {
		add_action( 'nitropack_purge_all', [ self::class, 'clear_ally_cache' ] );
		add_action( 'nitropack_purge_url', [ self::class, 'clear_ally_url_cache' ] );
	}

	public function add_wp_super_cache_clean_action() {
		add_action( 'wp_cache_cleared', [ self::class, 'clear_ally_cache' ] );
		add_action( 'wp_cache_post_edit', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_swcfpc_clean_action() {
		add_action( 'swcfpc_purge_all', [ self::class, 'clear_ally_cache' ] );
		add_action( 'swcfpc_purge_urls', [ self::class, 'clear_ally_list_cache' ] );
	}

	public function add_wpcc_clean_action() {
		add_action( 'cloudflare_purged_everything', [ self::class, 'clear_ally_cache' ] );
		add_action( 'cloudflare_purged_url', [ self::class, 'clear_ally_url_cache' ] );
	}

	public function add_afcf_clean_action() {
		add_action( 'afcf_after_purge_all', [ self::class, 'clear_ally_cache' ] );
		add_action( 'afcf_after_purge_post', [ self::class, 'clear_ally_post_cache' ] );
	}

	public function add_hosting_clean_action() {
		add_action( 'kinsta_purge_complete_caches_happened', [ self::class, 'clear_ally_cache' ] );
		//add_action( 'wpe_purged_all', [ self::class, 'clear_ally_cache' ] );
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
		 $this->add_cache_plugins_clean_actions();

		add_action( 'created_term', [ $this, 'clean_taxonomy_cache' ], 10, 3 );
		add_action( 'edited_term', [ $this, 'clean_taxonomy_cache' ], 10, 3 );
		add_action( 'save_post', [ $this, 'clean_post_cache' ], 10, 3 );
	}
}
