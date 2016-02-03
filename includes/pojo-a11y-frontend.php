<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

final class Pojo_A11y_Frontend {

	public function is_toolbar_active() {
		return 'disable' !== pojo_get_option( 'pojo_a11y_toolbar' );
	}

	public function is_toolbar_button_active( $button_type ) {
		return 'disable' !== pojo_get_option( "pojo_a11y_toolbar_button_{$button_type}" );
	}

	public function get_toolbar_button_title( $button_type ) {
		return pojo_get_option( "pojo_a11y_toolbar_button_{$button_type}_title" );
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
				'focusable' => ( 'enable' === pojo_get_option( 'pojo_a11y_focusable' ) ),
				'remove_link_target' => ( 'enable' === pojo_get_option( 'pojo_a11y_remove_link_target' ) ),
				'add_role_links' => ( 'enable' === pojo_get_option( 'pojo_a11y_add_role_links' ) ),
				'enable_save' => ( 'enable' === pojo_get_option( 'pojo_a11y_save' ) ),
				'save_expiration' => pojo_get_option( 'pojo_a11y_save_expiration'),
			)
		);
	}

	public function print_skip_to_content_link() {
		$skip_to_content_link = pojo_get_option( 'pojo_a11y_skip_to_content_link' );
		if ( 'disable' === $skip_to_content_link )
			return;
		
		?>
		<a id="pojo-a11y-skip-content" class="pojo-skip-link pojo-skip-content" tabindex="1" accesskey="s" href="#content"><?php _e( 'Skip to content', 'pojo-accessibility' ); ?></a>
		<?php
	}

	public function print_toolbar() {
		if ( ! $this->is_toolbar_active() )
			return;
		
		$toolbar_position = get_theme_mod( 'a11y_toolbar_position' );
		if ( empty( $toolbar_position ) || ! in_array( $toolbar_position, array( 'right', 'left' ) ) )
			$toolbar_position = 'left';
		
		$toolbar_title = pojo_get_option( 'pojo_a11y_toolbar_title' );
		$toolbar_visibility = pojo_get_option( 'pojo_a11y_toolbar' );
		
		$wrapper_classes = array(
			'pojo-a11y-toolbar-' . $toolbar_position,
		);
		
		if ( 'enable' !== $toolbar_visibility )
			$wrapper_classes[] = 'pojo-' . $toolbar_visibility;
		
		
		$sitemap_link = pojo_get_option( 'pojo_a11y_toolbar_button_sitemap_link' );
		$help_link = pojo_get_option( 'pojo_a11y_toolbar_button_help_link' );
		$feedback_link = pojo_get_option( 'pojo_a11y_toolbar_button_feedback_link' );
		
		$has_custom_links = ( ! empty( $sitemap_link ) || ! empty( $help_link ) || ! empty( $feedback_link ) );
		
		?>
		<nav id="pojo-a11y-toolbar" class="<?php echo esc_attr( implode( ' ', $wrapper_classes ) ); ?>" role="navigation">
			<div class="pojo-a11y-toolbar-toggle">
				<a class="pojo-a11y-toolbar-link pojo-a11y-toolbar-toggle-link" href="javascript:void(0);" title="<?php echo esc_attr( $toolbar_title ); ?>">
					<span class="sr-only"><?php _e( 'Open toolbar', 'pojo-accessibility' ); ?></span>
					<i class="fa fa-wheelchair"></i>
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
								<?php _e( 'Reset', 'pojo-accessibility' ); ?>
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

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( &$this, 'enqueue_scripts' ) );
		
		add_action( 'wp_footer', array( &$this, 'print_skip_to_content_link' ), 20 );
		add_action( 'wp_footer', array( &$this, 'print_toolbar' ), 30 );
	}
	
}