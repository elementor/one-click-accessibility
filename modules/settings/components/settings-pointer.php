<?php

namespace EA11y\Modules\Settings\Components;

use EA11y\Modules\Core\Components\Pointers;
use EA11y\Modules\Settings\Module as SettingsModule;
use EA11y\Classes\Utils;

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

        if ( Utils::is_plugin_settings_page() ) {
            return;
        }

		wp_enqueue_script( 'wp-pointer' );
		wp_enqueue_style( 'wp-pointer' );
		wp_enqueue_script( 'wp-util' );

		$pointer_content = '<h3>' . esc_html__( 'Ally - Web Accessibility', 'pojo-accessibility' ) . '</h3>';
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
				$( '#toplevel_page_accessibility-settings' ).pointer( {
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
			.ea11y-settings-pointer .wp-pointer-content h3::before {
				content: '';
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 78 78' preserveAspectRatio='xMidYMid meet' fill='none'%3E%3Crect width='50' height='50' fill='%23FF7BE5' rx='25'/%3E%3Cpath fill='%23fff' d='M25.258 17.523a2.928 2.928 0 1 0 0-5.856 2.928 2.928 0 0 0 0 5.856Z'/%3E%3Cpath fill='%23fff' d='M29.556 18.338a43.34 43.34 0 0 1-8.77 0l-6.528-1.027a1.701 1.701 0 0 0-1.758 1.701c0 .921.58 1.58 1.652 1.701l7.417.978-.61 15.147a1.556 1.556 0 0 0 3.11.116l.49-6.498a.784.784 0 0 1 1.565 0l.49 6.498a1.556 1.556 0 0 0 3.11-.117l-.542-13.34c0-.974.775-1.776 1.75-1.808l5.426-.976c1.08-.192 1.652-.78 1.652-1.7 0-.965-.796-1.734-1.758-1.704l-6.704 1.026.008.003Z'/%3E%3Cpath fill='%23FF7BE5' d='m18.32 22.387-3.103-1.517c6.766.767 7.427 1.133 10.547 1.2-3.223.177-6.048.55-7.443.315v.002Z'/%3E%3C/svg%3E");
			}
		</style>
		<?php
	}

	public function __construct() {
		add_action( 'in_admin_header', [ $this, 'admin_print_script' ] );
	}
}
