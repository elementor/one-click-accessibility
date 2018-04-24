<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

final class Pojo_A11y_Frontend {

	public $svg_icons = array();

	public function is_toolbar_active() {
		return 'disable' !== get_option( 'pojo_a11y_toolbar' );
	}

	public function is_toolbar_button_active( $button_type ) {
		return 'disable' !== get_option( "pojo_a11y_toolbar_button_{$button_type}" );
	}

	public function get_toolbar_button_title( $button_type ) {
		return get_option( "pojo_a11y_toolbar_button_{$button_type}_title" );
	}

	public function enqueue_scripts() {
		wp_register_script(
			'pojo-a11y',
			POJO_A11Y_ASSETS_URL . 'js/app.min.js',
			array(
				'jquery',
			),
			'1.0.0',
			true
		);

		wp_register_style(
			'pojo-a11y',
			POJO_A11Y_ASSETS_URL . 'css/style.min.css',
			array(),
			'1.0.0'
		);

		wp_enqueue_script( 'pojo-a11y' );
		wp_enqueue_style( 'pojo-a11y' );

		wp_localize_script(
			'pojo-a11y',
			'PojoA11yOptions',
			array(
				'focusable' => ( 'enable' === get_option( 'pojo_a11y_focusable' ) ),
				'remove_link_target' => ( 'enable' === get_option( 'pojo_a11y_remove_link_target' ) ),
				'add_role_links' => ( 'enable' === get_option( 'pojo_a11y_add_role_links' ) ),
				'enable_save' => ( 'enable' === get_option( 'pojo_a11y_save' ) ),
				'save_expiration' => get_option( 'pojo_a11y_save_expiration' ),
			)
		);
	}

	public function print_skip_to_content_link() {
		$skip_to_content_link = get_option( 'pojo_a11y_skip_to_content_link' );
		if ( 'disable' === $skip_to_content_link ) {
			return;
		}
		?>
		<a id="pojo-a11y-skip-content" class="pojo-skip-link pojo-skip-content" tabindex="1" accesskey="s" href="#content"><?php esc_html_e( 'Skip to content', 'pojo-accessibility' ); ?></a>
		<?php
	}

	public function print_toolbar() {
		if ( ! $this->is_toolbar_active() ) {
			return;
		}

		$customizer_options = get_option( POJO_A11Y_CUSTOMIZER_OPTIONS );

		$toolbar_position = $customizer_options['a11y_toolbar_position'];
		if ( empty( $toolbar_position ) || ! in_array( $toolbar_position, array( 'right', 'left' ) ) ) {
			$toolbar_position = 'left';
		}

		$toolbar_title = get_option( 'pojo_a11y_toolbar_title' );
		$toolbar_visibility = get_option( 'pojo_a11y_toolbar' );

		$wrapper_classes = array(
			'pojo-a11y-toolbar-' . $toolbar_position,
		);

		if ( 'enable' !== $toolbar_visibility ) {
			$wrapper_classes[] = 'pojo-' . $toolbar_visibility;
		}

		$sitemap_link = get_option( 'pojo_a11y_toolbar_button_sitemap_link' );
		$help_link = get_option( 'pojo_a11y_toolbar_button_help_link' );
		$feedback_link = get_option( 'pojo_a11y_toolbar_button_feedback_link' );

		$has_custom_links = ( ! empty( $sitemap_link ) || ! empty( $help_link ) || ! empty( $feedback_link ) );

		$icon = isset( $customizer_options['a11y_toolbar_icon'] ) ? $customizer_options['a11y_toolbar_icon'] : 'wheelchair';

		?>
		<nav id="pojo-a11y-toolbar" class="<?php echo esc_attr( implode( ' ', $wrapper_classes ) ); ?>" role="navigation">
			<div class="pojo-a11y-toolbar-toggle">
				<a class="pojo-a11y-toolbar-link pojo-a11y-toolbar-toggle-link" href="javascript:void(0);" title="<?php echo esc_attr( $toolbar_title ); ?>">
					<span class="sr-only"><?php esc_html_e( 'Open toolbar', 'pojo-accessibility' ); ?></span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" width="1em">
						<?php echo $this->get_svg_icon( $icon ); ?>
					</svg>
				</a>
			</div>
			<div class="pojo-a11y-toolbar-overlay">
				<div class="pojo-a11y-toolbar-inner">
					<p class="pojo-a11y-toolbar-title"><?php echo $toolbar_title; ?></p>
					
					<ul class="pojo-a11y-toolbar-items pojo-a11y-tools">
						<?php do_action( 'pojo_a11y_toolbar_before_buttons' ); ?>
						<?php if ( $this->is_toolbar_button_active( 'resize_font' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-resize-font pojo-a11y-btn-resize-plus" data-action="resize-plus" data-action-group="resize" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'resize_font_add' ); ?>
								</a>
							</li>
							
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-resize-font pojo-a11y-btn-resize-minus" data-action="resize-minus" data-action-group="resize" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'resize_font_less' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'grayscale' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-grayscale" data-action="grayscale" data-action-group="schema" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'grayscale' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'contrast' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-high-contrast" data-action="high-contrast" data-action-group="schema" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'high_contrast' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<li class="pojo-a11y-toolbar-item">
							<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-negative-contrast" data-action="negative-contrast" data-action-group="schema" tabindex="-1">
								<?php echo $this->get_toolbar_button_title( 'negative_contrast' ); ?>
							</a>
						</li>

						<?php if ( $this->is_toolbar_button_active( 'light_bg' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-light-background" data-action="light-background" data-action-group="schema" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'light_bg' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'links_underline' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-links-underline" data-action="links-underline" data-action-group="toggle" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'links_underline' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'readable_font' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-readable-font" data-action="readable-font" data-action-group="toggle" tabindex="-1">
									<?php echo $this->get_toolbar_button_title( 'readable_font' ); ?>
								</a>
							</li>
						<?php endif; ?>
						<?php do_action( 'pojo_a11y_toolbar_after_buttons' ); ?>
						<li class="pojo-a11y-toolbar-item">
							<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-reset" data-action="reset" tabindex="-1">
								<?php esc_html_e( 'Reset', 'pojo-accessibility' ); ?>
							</a>
						</li>
					</ul>
					<?php if ( $has_custom_links ) : ?>
					<ul class="pojo-a11y-toolbar-items pojo-a11y-links">
						<?php if ( ! empty( $sitemap_link ) ) : ?>
						<li class="pojo-a11y-toolbar-item">
							<a href="<?php echo esc_attr( $sitemap_link ); ?>" class="pojo-a11y-toolbar-link pojo-a11y-link-sitemap" tabindex="-1">
								<?php echo $this->get_toolbar_button_title( 'sitemap' ); ?>
							</a>
						</li>
						<?php endif; ?>
						<li class="pojo-a11y-toolbar-item">
							<a href="<?php echo esc_attr( $help_link ); ?>" class="pojo-a11y-toolbar-link pojo-a11y-link-help" tabindex="-1">
								<?php echo $this->get_toolbar_button_title( 'help' ); ?>
							</a>
						</li>
						<li class="pojo-a11y-toolbar-item">
							<a href="<?php echo esc_attr( $feedback_link ); ?>" class="pojo-a11y-toolbar-link pojo-a11y-link-feedback" tabindex="-1">
								<?php echo $this->get_toolbar_button_title( 'feedback' ); ?>
							</a>
						</li>
					</ul>
					<?php endif; ?>
				</div>
			</div>
		</nav>
		<?php
	}

	private function get_svg_icon( $icon ) {
		if ( isset( $this->svg_icons[ $icon ] ) ) {
			return $this->svg_icons[ $icon ];
		}

		return $this->svg_icons['accessibility'];
	}

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( &$this, 'enqueue_scripts' ) );

		add_action( 'wp_footer', array( &$this, 'print_skip_to_content_link' ), 20 );
		add_action( 'wp_footer', array( &$this, 'print_toolbar' ), 30 );
		$this->svg_icons = array(
			'wheelchair' => '<g><path d="M60.4,78.9c-2.2,4.1-5.3,7.4-9.2,9.8c-4,2.4-8.3,3.6-13,3.6c-6.9,0-12.8-2.4-17.7-7.3c-4.9-4.9-7.3-10.8-7.3-17.7c0-5,1.4-9.5,4.1-13.7c2.7-4.2,6.4-7.2,10.9-9.2l-0.9-7.3c-6.3,2.3-11.4,6.2-15.3,11.8C7.9,54.4,6,60.6,6,67.3c0,5.8,1.4,11.2,4.3,16.1s6.8,8.8,11.7,11.7c4.9,2.9,10.3,4.3,16.1,4.3c7,0,13.3-2.1,18.9-6.2c5.7-4.1,9.6-9.5,11.7-16.2l-5.7-11.4C63.5,70.4,62.5,74.8,60.4,78.9z"/><path d="M93.8,71.3l-11.1,5.5L70,51.4c-0.6-1.3-1.7-2-3.2-2H41.3l-0.9-7.2h22.7v-7.2H39.6L37.5,19c2.5,0.3,4.8-0.5,6.7-2.3c1.9-1.8,2.9-4,2.9-6.6c0-2.5-0.9-4.6-2.6-6.3c-1.8-1.8-3.9-2.6-6.3-2.6c-2,0-3.8,0.6-5.4,1.8c-1.6,1.2-2.7,2.7-3.2,4.6c-0.3,1-0.4,1.8-0.3,2.3l5.4,43.5c0.1,0.9,0.5,1.6,1.2,2.3c0.7,0.6,1.5,0.9,2.4,0.9h26.4l13.4,26.7c0.6,1.3,1.7,2,3.2,2c0.6,0,1.1-0.1,1.6-0.4L97,77.7L93.8,71.3z"/></g>',
			'accessibility' => '<path d="M50 8.1c23.2 0 41.9 18.8 41.9 41.9 0 23.2-18.8 41.9-41.9 41.9C26.8 91.9 8.1 73.2 8.1 50S26.8 8.1 50 8.1M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 11.3c-21.4 0-38.7 17.3-38.7 38.7S28.6 88.7 50 88.7 88.7 71.4 88.7 50 71.4 11.3 50 11.3zm0 8.9c4 0 7.3 3.2 7.3 7.3S54 34.7 50 34.7s-7.3-3.2-7.3-7.3 3.3-7.2 7.3-7.2zm23.7 19.7c-5.8 1.4-11.2 2.6-16.6 3.2.2 20.4 2.5 24.8 5 31.4.7 1.9-.2 4-2.1 4.7-1.9.7-4-.2-4.7-2.1-1.8-4.5-3.4-8.2-4.5-15.8h-2c-1 7.6-2.7 11.3-4.5 15.8-.7 1.9-2.8 2.8-4.7 2.1-1.9-.7-2.8-2.8-2.1-4.7 2.6-6.6 4.9-11 5-31.4-5.4-.6-10.8-1.8-16.6-3.2-1.7-.4-2.8-2.1-2.4-3.9.4-1.7 2.1-2.8 3.9-2.4 19.5 4.6 25.1 4.6 44.5 0 1.7-.4 3.5.7 3.9 2.4.7 1.8-.3 3.5-2.1 3.9z"/>',
		);
	}

}