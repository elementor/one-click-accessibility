<?php

namespace EA11y\Modules\Widget\Components;

use EA11y\Classes\Utils\Assets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Gutenberg_Link
 */
class Gutenberg_Link {

	public function enqueue_custom_link_block_assets() {
		register_block_type( 'ally/custom-link', [] );
		if ( is_admin() ) {
			Assets::enqueue_app_assets( 'gutenberg-custom-link', false );
		}
	}

	public function enqueue_custom_link_block_frontend( $block_content ) {
		wp_enqueue_script(
			'ea11y-gutenberg-custom-link',
			EA11Y_URL . 'modules/widget/assets/js/frontend.js',
			[],
			EA11Y_VERSION,
			true
		);
		return $block_content;
	}

	public function __construct() {
		add_action( 'init', [ $this, 'enqueue_custom_link_block_assets' ] );
		add_filter( 'render_block_ally/custom-link', [ $this, 'enqueue_custom_link_block_frontend' ] );
	}
}
