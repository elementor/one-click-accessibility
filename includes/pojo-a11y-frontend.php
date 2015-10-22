<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

final class Pojo_A11y_Frontend {

	public function is_toolbar_active() {
		return 'disable' !== pojo_get_option( 'pojo_a11y_toolbar' );
	}

	public function is_toolbar_button_active( $button_type ) {
		return 'disable' !== pojo_get_option( "pojo_a11y_toolbar_button_{$button_type}" );
	}

	public function enqueue_scripts() {
		if ( ! $this->is_toolbar_active() )
			return;
		
		
		wp_register_script(
			'pojo-a11y',
			POJO_A11Y_ASSETS_URL . 'js/app.min.js',
			array(
				'jquery'
			),
			'1.0.0',
			true
		);

		wp_register_style(
			'pojo-a11y',
			POJO_A11Y_ASSETS_URL . 'css/style.css',
			array(),
			'1.0.0'
		);
		
		wp_enqueue_script( 'pojo-a11y' );
		wp_enqueue_style( 'pojo-a11y' );
	}

	public function wp_footer() {
		if ( ! $this->is_toolbar_active() )
			return;
		
		$toolbar_position = pojo_get_option( 'pojo_a11y_toolbar_position' );
		if ( empty( $toolbar_position ) || ! in_array( $toolbar_position, array( 'right', 'left' ) ) )
			$toolbar_position = 'left';
		
		?>
		<div id="pojo-a11y-toolbar" class="pojo-a11y-toolbar-<?php echo $toolbar_position; ?>">
			<div class="pojo-a11y-toolbar-overlay">
				<div class="pojo-a11y-toolbar-inner">
					<p class="pojo-a11y-toolbar-title"><?php _e( 'Accessibility Title', 'pojo-accessibility' ); ?></p>
					
					<ul class="pojo-a11y-toolbar-items">
						<?php do_action( 'pojo_a11y_toolbar_before_buttons' ); ?>
						<?php if ( $this->is_toolbar_button_active( 'resize_font' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-resize-font" data-action="plus">
									<?php _e( 'A+', 'pojo-accessibility' ); ?>
								</a>
							</li>
							
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-resize-font" data-action="minus">
									<?php _e( 'A-', 'pojo-accessibility' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'grayscale' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-grayscale">
									<?php _e( 'Grayscale', 'pojo-accessibility' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'contrast' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-contrast">
									<?php _e( 'High Contrast', 'pojo-accessibility' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'light_bg' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-light-bg">
									<?php _e( 'Light Background', 'pojo-accessibility' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'links_underline' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-links-underline">
									<?php _e( 'Links Underline', 'pojo-accessibility' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'readable_font' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-btn-readable-font">
									<?php _e( 'Readable Font', 'pojo-accessibility' ); ?>
								</a>
							</li>
						<?php endif; ?>
						<?php do_action( 'pojo_a11y_toolbar_after_buttons' ); ?>
						<li class="pojo-a11y-toolbar-item">
							<a href="#" class="pojo-a11y-btn-reset">
								<?php _e( 'Reset', 'pojo-accessibility' ); ?>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="pojo-a11y-toolbar-toggle">
				<a href="#">
					<i class="fa fa-wheelchair"></i>
				</a>
			</div>
		</div>
		<?php
	}

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( &$this, 'enqueue_scripts' ) );
		add_action( 'wp_footer', array( &$this, 'wp_footer' ) );
	}
	
}