<?php

namespace EA11y\Modules\Core\Components;

use EA11y\Modules\Settings\Classes\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Skip_Link {
	private $settings;

	public function get_name(): string {
		return 'skip-link';
	}

	public function enqueue_skip_link_styles() {
		wp_enqueue_style(
			'ea11y-skip-link',
			EA11Y_ASSETS_URL . 'build/skip-link.css',
			[],
			EA11Y_VERSION
		);
	}

	public function render_skip_link() {
		?>
		<script>
			const onSkipLinkClick = () => {
				const htmlElement = document.querySelector('html');

				htmlElement.style['scroll-behavior'] = 'smooth';

				setTimeout( () => htmlElement.style['scroll-behavior'] = null, 1000 );
			}
			document.addEventListener("DOMContentLoaded", () => {
				if (!document.querySelector('<?php echo esc_url( $this->settings['anchor'] ); ?>')) {
					document.querySelector('.ea11y-skip-to-content-link').remove();
				}
			});
		</script>
		<nav aria-label="<?php esc_attr_e( 'Skip to content navigation', 'pojo-accessibility' ); ?>">
			<a class="ea11y-skip-to-content-link"
				href="<?php echo esc_url( $this->settings['anchor'] ); ?>"
				tabindex="1"
				onclick="onSkipLinkClick()"
			>
				<?php esc_attr_e( 'Skip to content', 'pojo-accessibility' ); ?>

				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" role="presentation">
					<path d="M18 6V12C18 12.7956 17.6839 13.5587 17.1213 14.1213C16.5587 14.6839 15.7956 15 15 15H5M5 15L9 11M5 15L9 19"
								stroke="black"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
					/>
				</svg>
			</a>
			<div class="ea11y-skip-to-content-backdrop"></div>
		</nav>

		<?php
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->settings = get_option( Settings::SKIP_TO_CONTENT );

		if ( $this->settings && ! empty( $this->settings['enabled'] ) ) {
			remove_action( 'wp_footer', 'the_block_template_skip_link' );
			add_filter( 'hello_elementor_enable_skip_link', '__return_false' );

			add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_skip_link_styles' ] );
			add_action( 'wp_body_open', [ $this, 'render_skip_link' ] );
		}
	}
}
