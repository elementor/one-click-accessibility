<?php

namespace EA11y\Modules\Settings\Components;

use EA11y\Modules\Core\Components\Pointers;
use EA11y\Modules\Settings\Module as SettingsModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings_Pointer {
	const CURRENT_POINTER_SLUG = 'ea11y-settings';

	public function admin_print_script() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( Pointers::is_dismissed( self::CURRENT_POINTER_SLUG ) ) {
			return;
		}

		wp_enqueue_script( 'wp-pointer' );
		wp_enqueue_style( 'wp-pointer' );

		$pointer_content = '<h3>' . esc_html__( 'One Click Accessibility', 'pojo-accessibility' ) . '</h3>';
		$pointer_content .= '<p>' . esc_html__( "Start setting up and customizing your site's accessibility widget.", 'pojo-accessibility' ) . '</p>';

		$pointer_content .= sprintf(
			'<p><a class="button button-primary ea11y-pointer-settings-link" href="%s">%s</a></p>',
			admin_url( 'admin.php?page=' . SettingsModule::SETTING_BASE_SLUG ),
			esc_html__( 'Get Started', 'pojo-accessibility' )
		);

		$allowed_tags = [
			'h3' => [],
			'p' => [],
			'a' => [
				'class' => [],
				'href' => [],
			],
		];
		?>
		<script>
			const onClose = () => {
				return wp.ajax.post( 'ea11y_pointer_dismissed', {
					data: {
						pointer: '<?php echo esc_attr( static::CURRENT_POINTER_SLUG ); ?>',
					},
					nonce: '<?php echo esc_attr( wp_create_nonce( 'ea11y-pointer-dismissed' ) ); ?>',
				} );
			}

			jQuery( document ).ready( function( $ ) {
				//TODO: Update page URL
				$( '#toplevel_page_accessibility-settings-2' ).pointer( {
					content: '<?php echo wp_kses( $pointer_content, $allowed_tags ); ?>',
					pointerClass: 'ea11y-settings-pointer',
					position: {
						edge: <?php echo is_rtl() ? "'right'" : "'left'"; ?>,
						align: 'center'
					},
					close: onClose
				} ).pointer( 'open' );

				$( '.ea11y-pointer-settings-link' ).first().on( 'click', function( e ) {
					e.preventDefault();

					$(this).attr( 'disabled', true );

					onClose().promise().done(() => {
						location = $(this).attr( 'href' );
					});
				})
			} );
		</script>

		<style>
			/* TODO: Update icon */
			.ea11y-settings-pointer .wp-pointer-content h3::before {
				content: '';
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none'%3E%3Cg clip-path='url(%23a)'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23FF7BE5'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M15.945 7.707a.142.142 0 0 1 .11 0l9.981 4.212c.3.126.496.42.496.746V23.9a.405.405 0 0 1-.405.404H5.872a.405.405 0 0 1-.405-.404V12.168L16 15.798l3.443-.507L16 17.013v7.183a.04.04 0 0 0 .07.027l10.122-11.567a.304.304 0 0 0-.229-.504H5.468v-.024l10.477-4.42Z' clip-rule='evenodd'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h32v32H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
			}
		</style>
		<?php
	}

	public function __construct() {
		add_action( 'in_admin_header', [ $this, 'admin_print_script' ] );
	}
}
