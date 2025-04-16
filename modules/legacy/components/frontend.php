<?php

namespace EA11y\Modules\Legacy\Components;

use EA11y\Modules\Legacy\Module;
use EA11y\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Frontend
 */
class Frontend {
	public $svg_icons = null;

	public function is_toolbar_active() {
		$is_active = 'disable' !== get_option( 'pojo_a11y_toolbar' );

		$is_active = apply_filters( 'pojo_a11y_frontend_is_toolbar_active', $is_active );

		return $is_active;
	}

	public function is_toolbar_button_active( $button_type ): bool {
		return 'disable' !== get_option( "pojo_a11y_toolbar_button_{$button_type}" );
	}

	public function get_toolbar_button_title( $button_type ) {
		/**
		 * @var Settings $settings
		 */
		$settings = Module::get_settings();
		$title = $settings->get_default_title_text( "pojo_a11y_toolbar_button_{$button_type}_title" );
		return '<span class="pojo-a11y-toolbar-icon">' . $this->get_toolbar_svg( $button_type, $title ) . '</span><span class="pojo-a11y-toolbar-text">' . $title . '</span>';
	}

	public function enqueue_scripts() {
		$assets_url = EA11Y_URL . 'modules/legacy/assets/';
		wp_register_script(
			'pojo-a11y',
			$assets_url . 'js/app.min.js',
			[ 'jquery' ],
			'1.0.0',
			true
		);

		wp_register_style(
			'pojo-a11y',
			$assets_url . 'css/style.min.css',
			[],
			'1.0.0'
		);

		wp_enqueue_script( 'pojo-a11y' );
		wp_enqueue_style( 'pojo-a11y' );

		wp_localize_script(
			'pojo-a11y',
			'PojoA11yOptions',
			[
				'focusable' => ( 'enable' === get_option( 'pojo_a11y_focusable' ) ),
				'remove_link_target' => ( 'enable' === get_option( 'pojo_a11y_remove_link_target' ) ),
				'add_role_links' => ( 'enable' === get_option( 'pojo_a11y_add_role_links' ) ),
				'enable_save' => ( 'enable' === get_option( 'pojo_a11y_save' ) ),
				'save_expiration' => get_option( 'pojo_a11y_save_expiration' ),
			]
		);
	}

	public function print_skip_to_content_link() {
		$skip_to_content_link = get_option( 'pojo_a11y_skip_to_content_link' );
		if ( 'disable' === $skip_to_content_link ) {
			return;
		}

		$element_id = get_option( 'pojo_a11y_skip_to_content_link_element_id', 'content' );

		?>
		<a id="pojo-a11y-skip-content" class="pojo-skip-link pojo-skip-content" tabindex="1" accesskey="s" href="#<?php echo esc_html( $element_id ); ?>"><?php esc_html_e( 'Skip to content', 'pojo-accessibility' ); ?></a>
		<?php
	}

	public function print_toolbar() {
		if ( ! $this->is_toolbar_active() ) {
			return;
		}

		$customizer_options = get_option( POJO_A11Y_CUSTOMIZER_OPTIONS );

		$toolbar_position = $customizer_options['a11y_toolbar_position'];
		if ( empty( $toolbar_position ) || ! in_array( $toolbar_position, [ 'right', 'left' ] ) ) {
			$toolbar_position = 'left';
		}
		$settings = Module::get_settings();
		$toolbar_title = $settings->get_default_title_text( 'pojo_a11y_toolbar_title' );
		$toolbar_visibility = get_option( 'pojo_a11y_toolbar' );

		$wrapper_classes = [
			'pojo-a11y-toolbar-' . $toolbar_position,
		];

		if ( 'enable' !== $toolbar_visibility ) {
			$wrapper_classes[] = 'pojo-a11y-' . $toolbar_visibility;
		}

		$sitemap_link = get_option( 'pojo_a11y_toolbar_button_sitemap_link' );
		$help_link = get_option( 'pojo_a11y_toolbar_button_help_link' );
		$feedback_link = get_option( 'pojo_a11y_toolbar_button_feedback_link' );

		$has_custom_links = ( ! empty( $sitemap_link ) || ! empty( $help_link ) || ! empty( $feedback_link ) );

		$icon = isset( $customizer_options['a11y_toolbar_icon'] ) ? $customizer_options['a11y_toolbar_icon'] : 'one-click';

		?>
		<nav id="pojo-a11y-toolbar" class="<?php echo esc_attr( implode( ' ', $wrapper_classes ) ); ?>" role="navigation">
			<div class="pojo-a11y-toolbar-toggle">
				<a class="pojo-a11y-toolbar-link pojo-a11y-toolbar-toggle-link" href="javascript:void(0);" title="<?php echo esc_attr( $toolbar_title ); ?>" role="button">
					<span class="pojo-sr-only sr-only"><?php esc_html_e( 'Open toolbar', 'pojo-accessibility' ); ?></span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" width="1em">
						<title><?php echo esc_html( $toolbar_title ); ?></title>
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
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-resize-font pojo-a11y-btn-resize-plus" data-action="resize-plus" data-action-group="resize" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'resize_font_add' ); ?>
								</a>
							</li>

							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-resize-font pojo-a11y-btn-resize-minus" data-action="resize-minus" data-action-group="resize" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'resize_font_less' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'grayscale' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-grayscale" data-action="grayscale" data-action-group="schema" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'grayscale' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'high_contrast' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-high-contrast" data-action="high-contrast" data-action-group="schema" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'high_contrast' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'negative_contrast' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-negative-contrast" data-action="negative-contrast" data-action-group="schema" tabindex="-1" role="button">

									<?php echo $this->get_toolbar_button_title( 'negative_contrast' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'light_bg' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-background-group pojo-a11y-btn-light-background" data-action="light-background" data-action-group="schema" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'light_bg' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'links_underline' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-links-underline" data-action="links-underline" data-action-group="toggle" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'links_underline' ); ?>
								</a>
							</li>
						<?php endif; ?>

						<?php if ( $this->is_toolbar_button_active( 'readable_font' ) ) : ?>
							<li class="pojo-a11y-toolbar-item">
								<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-readable-font" data-action="readable-font" data-action-group="toggle" tabindex="-1" role="button">
									<?php echo $this->get_toolbar_button_title( 'readable_font' ); ?>
								</a>
							</li>
						<?php endif; ?>
						<?php do_action( 'pojo_a11y_toolbar_after_buttons' ); ?>
						<li class="pojo-a11y-toolbar-item">
							<a href="#" class="pojo-a11y-toolbar-link pojo-a11y-btn-reset" data-action="reset" tabindex="-1" role="button">
								<span class="pojo-a11y-toolbar-icon"><?php echo $this->get_toolbar_svg( 'reset', esc_html__( 'Reset', 'pojo-accessibility' ) ); ?></span>
								<span class="pojo-a11y-toolbar-text"><?php esc_html_e( 'Reset', 'pojo-accessibility' ); ?></span>
							</a>
						</li>
					</ul>
					<?php if ( $has_custom_links ) : ?>
						<ul class="pojo-a11y-toolbar-items pojo-a11y-links">
							<?php if ( ! empty( $sitemap_link ) ) : ?>
								<li class="pojo-a11y-toolbar-item">
									<a href="<?php echo esc_url( $sitemap_link ); ?>" class="pojo-a11y-toolbar-link pojo-a11y-link-sitemap" tabindex="-1" role="button">
										<?php echo $this->get_toolbar_button_title( 'sitemap' ); ?>
									</a>
								</li>
							<?php endif; ?>
							<?php if ( ! empty( $help_link ) ) : ?>
								<li class="pojo-a11y-toolbar-item">
									<a href="<?php echo esc_url( $help_link ); ?>" class="pojo-a11y-toolbar-link pojo-a11y-link-help" tabindex="-1" role="button">
										<?php echo $this->get_toolbar_button_title( 'help' ); ?>
									</a>
								</li>
							<?php endif; ?>
							<?php if ( ! empty( $feedback_link ) ) : ?>
								<li class="pojo-a11y-toolbar-item">
									<a href="<?php echo esc_url( $feedback_link ); ?>" class="pojo-a11y-toolbar-link pojo-a11y-link-feedback" tabindex="-1" role="button">
										<?php echo $this->get_toolbar_button_title( 'feedback' ); ?>
									</a>
								</li>
							<?php endif; ?>
						</ul>
					<?php endif; ?>
				</div>
			</div>
		</nav>
		<?php
	}

	private function get_toolbar_svg( $icon, $icon_title = '' ) {
		$icons = [
			'resize_font_add'   => '<path fill="currentColor" d="M256 200v16c0 4.25-3.75 8-8 8h-56v56c0 4.25-3.75 8-8 8h-16c-4.25 0-8-3.75-8-8v-56h-56c-4.25 0-8-3.75-8-8v-16c0-4.25 3.75-8 8-8h56v-56c0-4.25 3.75-8 8-8h16c4.25 0 8 3.75 8 8v56h56c4.25 0 8 3.75 8 8zM288 208c0-61.75-50.25-112-112-112s-112 50.25-112 112 50.25 112 112 112 112-50.25 112-112zM416 416c0 17.75-14.25 32-32 32-8.5 0-16.75-3.5-22.5-9.5l-85.75-85.5c-29.25 20.25-64.25 31-99.75 31-97.25 0-176-78.75-176-176s78.75-176 176-176 176 78.75 176 176c0 35.5-10.75 70.5-31 99.75l85.75 85.75c5.75 5.75 9.25 14 9.25 22.5z"></path>',
			'resize_font_less'  => '<path fill="currentColor" d="M256 200v16c0 4.25-3.75 8-8 8h-144c-4.25 0-8-3.75-8-8v-16c0-4.25 3.75-8 8-8h144c4.25 0 8 3.75 8 8zM288 208c0-61.75-50.25-112-112-112s-112 50.25-112 112 50.25 112 112 112 112-50.25 112-112zM416 416c0 17.75-14.25 32-32 32-8.5 0-16.75-3.5-22.5-9.5l-85.75-85.5c-29.25 20.25-64.25 31-99.75 31-97.25 0-176-78.75-176-176s78.75-176 176-176 176 78.75 176 176c0 35.5-10.75 70.5-31 99.75l85.75 85.75c5.75 5.75 9.25 14 9.25 22.5z"></path>',
			'grayscale'         => '<path fill="currentColor" d="M15.75 384h-15.75v-352h15.75v352zM31.5 383.75h-8v-351.75h8v351.75zM55 383.75h-7.75v-351.75h7.75v351.75zM94.25 383.75h-7.75v-351.75h7.75v351.75zM133.5 383.75h-15.5v-351.75h15.5v351.75zM165 383.75h-7.75v-351.75h7.75v351.75zM180.75 383.75h-7.75v-351.75h7.75v351.75zM196.5 383.75h-7.75v-351.75h7.75v351.75zM235.75 383.75h-15.75v-351.75h15.75v351.75zM275 383.75h-15.75v-351.75h15.75v351.75zM306.5 383.75h-15.75v-351.75h15.75v351.75zM338 383.75h-15.75v-351.75h15.75v351.75zM361.5 383.75h-15.75v-351.75h15.75v351.75zM408.75 383.75h-23.5v-351.75h23.5v351.75zM424.5 383.75h-8v-351.75h8v351.75zM448 384h-15.75v-352h15.75v352z"></path>',
			'high_contrast'     => '<path fill="currentColor" d="M192 360v-272c-75 0-136 61-136 136s61 136 136 136zM384 224c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192z"></path>',
			'negative_contrast' => '<path fill="currentColor" d="M416 240c-23.75-36.75-56.25-68.25-95.25-88.25 10 17 15.25 36.5 15.25 56.25 0 61.75-50.25 112-112 112s-112-50.25-112-112c0-19.75 5.25-39.25 15.25-56.25-39 20-71.5 51.5-95.25 88.25 42.75 66 111.75 112 192 112s149.25-46 192-112zM236 144c0-6.5-5.5-12-12-12-41.75 0-76 34.25-76 76 0 6.5 5.5 12 12 12s12-5.5 12-12c0-28.5 23.5-52 52-52 6.5 0 12-5.5 12-12zM448 240c0 6.25-2 12-5 17.25-46 75.75-130.25 126.75-219 126.75s-173-51.25-219-126.75c-3-5.25-5-11-5-17.25s2-12 5-17.25c46-75.5 130.25-126.75 219-126.75s173 51.25 219 126.75c3 5.25 5 11 5 17.25z"></path>',
			'light_bg' => '<path fill="currentColor" d="M184 144c0 4.25-3.75 8-8 8s-8-3.75-8-8c0-17.25-26.75-24-40-24-4.25 0-8-3.75-8-8s3.75-8 8-8c23.25 0 56 12.25 56 40zM224 144c0-50-50.75-80-96-80s-96 30-96 80c0 16 6.5 32.75 17 45 4.75 5.5 10.25 10.75 15.25 16.5 17.75 21.25 32.75 46.25 35.25 74.5h57c2.5-28.25 17.5-53.25 35.25-74.5 5-5.75 10.5-11 15.25-16.5 10.5-12.25 17-29 17-45zM256 144c0 25.75-8.5 48-25.75 67s-40 45.75-42 72.5c7.25 4.25 11.75 12.25 11.75 20.5 0 6-2.25 11.75-6.25 16 4 4.25 6.25 10 6.25 16 0 8.25-4.25 15.75-11.25 20.25 2 3.5 3.25 7.75 3.25 11.75 0 16.25-12.75 24-27.25 24-6.5 14.5-21 24-36.75 24s-30.25-9.5-36.75-24c-14.5 0-27.25-7.75-27.25-24 0-4 1.25-8.25 3.25-11.75-7-4.5-11.25-12-11.25-20.25 0-6 2.25-11.75 6.25-16-4-4.25-6.25-10-6.25-16 0-8.25 4.5-16.25 11.75-20.5-2-26.75-24.75-53.5-42-72.5s-25.75-41.25-25.75-67c0-68 64.75-112 128-112s128 44 128 112z"></path>',
			'links_underline' => '<path fill="currentColor" d="M364 304c0-6.5-2.5-12.5-7-17l-52-52c-4.5-4.5-10.75-7-17-7-7.25 0-13 2.75-18 8 8.25 8.25 18 15.25 18 28 0 13.25-10.75 24-24 24-12.75 0-19.75-9.75-28-18-5.25 5-8.25 10.75-8.25 18.25 0 6.25 2.5 12.5 7 17l51.5 51.75c4.5 4.5 10.75 6.75 17 6.75s12.5-2.25 17-6.5l36.75-36.5c4.5-4.5 7-10.5 7-16.75zM188.25 127.75c0-6.25-2.5-12.5-7-17l-51.5-51.75c-4.5-4.5-10.75-7-17-7s-12.5 2.5-17 6.75l-36.75 36.5c-4.5 4.5-7 10.5-7 16.75 0 6.5 2.5 12.5 7 17l52 52c4.5 4.5 10.75 6.75 17 6.75 7.25 0 13-2.5 18-7.75-8.25-8.25-18-15.25-18-28 0-13.25 10.75-24 24-24 12.75 0 19.75 9.75 28 18 5.25-5 8.25-10.75 8.25-18.25zM412 304c0 19-7.75 37.5-21.25 50.75l-36.75 36.5c-13.5 13.5-31.75 20.75-50.75 20.75-19.25 0-37.5-7.5-51-21.25l-51.5-51.75c-13.5-13.5-20.75-31.75-20.75-50.75 0-19.75 8-38.5 22-52.25l-22-22c-13.75 14-32.25 22-52 22-19 0-37.5-7.5-51-21l-52-52c-13.75-13.75-21-31.75-21-51 0-19 7.75-37.5 21.25-50.75l36.75-36.5c13.5-13.5 31.75-20.75 50.75-20.75 19.25 0 37.5 7.5 51 21.25l51.5 51.75c13.5 13.5 20.75 31.75 20.75 50.75 0 19.75-8 38.5-22 52.25l22 22c13.75-14 32.25-22 52-22 19 0 37.5 7.5 51 21l52 52c13.75 13.75 21 31.75 21 51z"></path>',
			'readable_font' => '<path fill="currentColor" d="M181.25 139.75l-42.5 112.5c24.75 0.25 49.5 1 74.25 1 4.75 0 9.5-0.25 14.25-0.5-13-38-28.25-76.75-46-113zM0 416l0.5-19.75c23.5-7.25 49-2.25 59.5-29.25l59.25-154 70-181h32c1 1.75 2 3.5 2.75 5.25l51.25 120c18.75 44.25 36 89 55 133 11.25 26 20 52.75 32.5 78.25 1.75 4 5.25 11.5 8.75 14.25 8.25 6.5 31.25 8 43 12.5 0.75 4.75 1.5 9.5 1.5 14.25 0 2.25-0.25 4.25-0.25 6.5-31.75 0-63.5-4-95.25-4-32.75 0-65.5 2.75-98.25 3.75 0-6.5 0.25-13 1-19.5l32.75-7c6.75-1.5 20-3.25 20-12.5 0-9-32.25-83.25-36.25-93.5l-112.5-0.5c-6.5 14.5-31.75 80-31.75 89.5 0 19.25 36.75 20 51 22 0.25 4.75 0.25 9.5 0.25 14.5 0 2.25-0.25 4.5-0.5 6.75-29 0-58.25-5-87.25-5-3.5 0-8.5 1.5-12 2-15.75 2.75-31.25 3.5-47 3.5z"></path>',
			'reset' => '<path fill="currentColor" d="M384 224c0 105.75-86.25 192-192 192-57.25 0-111.25-25.25-147.75-69.25-2.5-3.25-2.25-8 0.5-10.75l34.25-34.5c1.75-1.5 4-2.25 6.25-2.25 2.25 0.25 4.5 1.25 5.75 3 24.5 31.75 61.25 49.75 101 49.75 70.5 0 128-57.5 128-128s-57.5-128-128-128c-32.75 0-63.75 12.5-87 34.25l34.25 34.5c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-112c-8.75 0-16-7.25-16-16v-112c0-6.5 4-12.25 10-14.75 5.75-2.5 12.75-1.25 17.25 3.5l32.5 32.25c35.25-33.25 83-53 132.25-53 105.75 0 192 86.25 192 192z"></path>',
			'sitemap' => '<path fill="currentColor" d="M448 312v80c0 13.25-10.75 24-24 24h-80c-13.25 0-24-10.75-24-24v-80c0-13.25 10.75-24 24-24h24v-48h-128v48h24c13.25 0 24 10.75 24 24v80c0 13.25-10.75 24-24 24h-80c-13.25 0-24-10.75-24-24v-80c0-13.25 10.75-24 24-24h24v-48h-128v48h24c13.25 0 24 10.75 24 24v80c0 13.25-10.75 24-24 24h-80c-13.25 0-24-10.75-24-24v-80c0-13.25 10.75-24 24-24h24v-48c0-17.5 14.5-32 32-32h128v-48h-24c-13.25 0-24-10.75-24-24v-80c0-13.25 10.75-24 24-24h80c13.25 0 24 10.75 24 24v80c0 13.25-10.75 24-24 24h-24v48h128c17.5 0 32 14.5 32 32v48h24c13.25 0 24 10.75 24 24z"></path>',
			'help' => '<path fill="currentColor" d="M224 344v-48c0-4.5-3.5-8-8-8h-48c-4.5 0-8 3.5-8 8v48c0 4.5 3.5 8 8 8h48c4.5 0 8-3.5 8-8zM288 176c0-45.75-48-80-91-80-40.75 0-71.25 17.5-92.75 53.25-2.25 3.5-1.25 8 2 10.5l33 25c1.25 1 3 1.5 4.75 1.5 2.25 0 4.75-1 6.25-3 11.75-15 16.75-19.5 21.5-23 4.25-3 12.5-6 21.5-6 16 0 30.75 10.25 30.75 21.25 0 13-6.75 19.5-22 26.5-17.75 8-42 28.75-42 53v9c0 4.5 3.5 8 8 8h48c4.5 0 8-3.5 8-8v0c0-5.75 7.25-18 19-24.75 19-10.75 45-25.25 45-63.25zM384 224c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192z"></path>',
			'feedback' => '<path fill="currentColor" d="M448 224c0 88.5-100.25 160-224 160-12.25 0-24.5-0.75-36.25-2-32.75 29-71.75 49.5-115 60.5-9 2.5-18.75 4.25-28.5 5.5-5.5 0.5-10.75-3.5-12-9.5v-0.25c-1.25-6.25 3-10 6.75-14.5 15.75-17.75 33.75-32.75 45.5-74.5-51.5-29.25-84.5-74.5-84.5-125.25 0-88.25 100.25-160 224-160s224 71.5 224 160z"></path>',
		];

		if ( isset( $icons[ $icon ] ) ) {
			$icon_title_html = '';
			if ( ! empty( $icon_title ) ) {
				$icon_title_html = '<title>' . esc_html( $icon_title ) . '</title>';
			}

			return sprintf( '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448">%s%s</svg>', $icon_title_html, $icons[ $icon ] );
		}

		return '';
	}

	private function get_svg_icon( $icon ) {
		if ( null === $this->svg_icons ) {
			$this->svg_icons = [
				'wheelchair' => '<g><path d="M60.4,78.9c-2.2,4.1-5.3,7.4-9.2,9.8c-4,2.4-8.3,3.6-13,3.6c-6.9,0-12.8-2.4-17.7-7.3c-4.9-4.9-7.3-10.8-7.3-17.7c0-5,1.4-9.5,4.1-13.7c2.7-4.2,6.4-7.2,10.9-9.2l-0.9-7.3c-6.3,2.3-11.4,6.2-15.3,11.8C7.9,54.4,6,60.6,6,67.3c0,5.8,1.4,11.2,4.3,16.1s6.8,8.8,11.7,11.7c4.9,2.9,10.3,4.3,16.1,4.3c7,0,13.3-2.1,18.9-6.2c5.7-4.1,9.6-9.5,11.7-16.2l-5.7-11.4C63.5,70.4,62.5,74.8,60.4,78.9z"/><path d="M93.8,71.3l-11.1,5.5L70,51.4c-0.6-1.3-1.7-2-3.2-2H41.3l-0.9-7.2h22.7v-7.2H39.6L37.5,19c2.5,0.3,4.8-0.5,6.7-2.3c1.9-1.8,2.9-4,2.9-6.6c0-2.5-0.9-4.6-2.6-6.3c-1.8-1.8-3.9-2.6-6.3-2.6c-2,0-3.8,0.6-5.4,1.8c-1.6,1.2-2.7,2.7-3.2,4.6c-0.3,1-0.4,1.8-0.3,2.3l5.4,43.5c0.1,0.9,0.5,1.6,1.2,2.3c0.7,0.6,1.5,0.9,2.4,0.9h26.4l13.4,26.7c0.6,1.3,1.7,2,3.2,2c0.6,0,1.1-0.1,1.6-0.4L97,77.7L93.8,71.3z"/></g>',
				'one-click' => '<path d="M50 .8c5.7 0 10.4 4.7 10.4 10.4S55.7 21.6 50 21.6s-10.4-4.7-10.4-10.4S44.3.8 50 .8zM92.2 32l-21.9 2.3c-2.6.3-4.6 2.5-4.6 5.2V94c0 2.9-2.3 5.2-5.2 5.2H60c-2.7 0-4.9-2.1-5.2-4.7l-2.2-24.7c-.1-1.5-1.4-2.5-2.8-2.4-1.3.1-2.2 1.1-2.4 2.4l-2.2 24.7c-.2 2.7-2.5 4.7-5.2 4.7h-.5c-2.9 0-5.2-2.3-5.2-5.2V39.4c0-2.7-2-4.9-4.6-5.2L7.8 32c-2.6-.3-4.6-2.5-4.6-5.2v-.5c0-2.6 2.1-4.7 4.7-4.7h.5c19.3 1.8 33.2 2.8 41.7 2.8s22.4-.9 41.7-2.8c2.6-.2 4.9 1.6 5.2 4.3v1c-.1 2.6-2.1 4.8-4.8 5.1z"/>',
				'accessibility' => '<path d="M50 8.1c23.2 0 41.9 18.8 41.9 41.9 0 23.2-18.8 41.9-41.9 41.9C26.8 91.9 8.1 73.2 8.1 50S26.8 8.1 50 8.1M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 11.3c-21.4 0-38.7 17.3-38.7 38.7S28.6 88.7 50 88.7 88.7 71.4 88.7 50 71.4 11.3 50 11.3zm0 8.9c4 0 7.3 3.2 7.3 7.3S54 34.7 50 34.7s-7.3-3.2-7.3-7.3 3.3-7.2 7.3-7.2zm23.7 19.7c-5.8 1.4-11.2 2.6-16.6 3.2.2 20.4 2.5 24.8 5 31.4.7 1.9-.2 4-2.1 4.7-1.9.7-4-.2-4.7-2.1-1.8-4.5-3.4-8.2-4.5-15.8h-2c-1 7.6-2.7 11.3-4.5 15.8-.7 1.9-2.8 2.8-4.7 2.1-1.9-.7-2.8-2.8-2.1-4.7 2.6-6.6 4.9-11 5-31.4-5.4-.6-10.8-1.8-16.6-3.2-1.7-.4-2.8-2.1-2.4-3.9.4-1.7 2.1-2.8 3.9-2.4 19.5 4.6 25.1 4.6 44.5 0 1.7-.4 3.5.7 3.9 2.4.7 1.8-.3 3.5-2.1 3.9z"/>',
			];
		}

		if ( isset( $this->svg_icons[ $icon ] ) ) {
			return $this->svg_icons[ $icon ];
		}

		return $this->svg_icons['accessibility'];
	}

	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_footer', [ $this, 'print_skip_to_content_link' ], 20 );
		add_action( 'wp_footer', [ $this, 'print_toolbar' ], 30 );
	}
}
