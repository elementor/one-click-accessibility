<?php

namespace EA11y\Modules\Legacy\Components;

use EA11y\Modules\Connect\Classes\Config;
use EA11y\Modules\Core\Components\Notices;
use EA11y\Modules\Core\Components\Pointers;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Admin
 */
class Upgrade {
	const UPGRADED_OPTION = 'ea11y_upgraded';
	const AJAX_ACTION = 'ea11y_upgrade';
	const INTRODUCTION_NOTICE = 'ea11y_introduction_notice';
	const CONFIRMATION_MODAL = 'ea11y_confirmation_modal';
	/**
	 * @var true
	 */
	private bool $disable_introduction_modal = false;

	/**
	 * upgrade
	 */
	public static function upgrade() : void {
		update_option( self::UPGRADED_OPTION, true );
	}

	/**
	 * is_upgraded
	 * @return bool
	 */
	public static function is_upgraded() : bool {
		return (bool) get_option( self::UPGRADED_OPTION, false );
	}

	/**
	 * is_legacy_page
	 * @return bool
	 */
	public static function is_legacy_page() : bool {
		return in_array( get_current_screen()->base, [ Settings::SETTINGS_PAGE, Settings::TOOLBAR_PAGE ] );
	}

	/**
	 * get_learn_more_link
	 * @return string
	 */
	public static function get_learn_more_link() : string {
		return 'https://www.pojo.me/accessibility/';
	}

	/**
	 * get_switch_now_link
	 * @return string
	 */
	public static function get_switch_now_link() : string {
		return add_query_arg( [
			'page' => 'accessibility-settings',
			self::CONFIRMATION_MODAL => '1',
		], admin_url() );
	}

	/**
	 * add_deprecated_notice_to_customizer_section_description
	 * @return string
	 */
	public function add_deprecated_notice_to_customizer_section_description(): string {
		$content = sprintf(
			'<p>%s</p><p><a href=\"%s\">%s</a></p><p><a class=\"button\" href=\"%s\">%s</a></p>',
			esc_html__( 'New! Switch to our updated accessibility widget for better features and control.', 'pojo-accessibility' ),
			self::get_learn_more_link(),
			esc_html__( 'Learn More', 'pojo-accessibility' ),
			self::get_switch_now_link(),
			esc_html__( 'Switch Now', 'pojo-accessibility' )
		);
		return "<script>
		jQuery( document ).ready( () => { 
			const api = wp.customize;
			api.notifications.add( new api.Notification( 'deprecated', {
			    message: '" . $content . "',
			    type: 'info',
			    dismissible: false,
			} ) )
		} );</script>";
	}

	/**
	 * maybe_add_introduction_modal
	 */
	public function maybe_add_introduction_modal() {
		if ( $this->disable_introduction_modal ) {
			return;
		}

		// only show to admins on legacy pages and to admin users
		if ( ! $this->is_legacy_page() || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$dismissed = get_user_meta( get_current_user_id(), self::INTRODUCTION_NOTICE, true );
		if ( $dismissed ) {
			return;
		}

		add_thickbox();
		wp_enqueue_script( 'jquery' );
		add_action( 'admin_footer', function() {
			?>
			<div  id="<?php echo esc_html( self::INTRODUCTION_NOTICE ); ?>" style="display:none;">
				<div data-modal-slug="<?php echo esc_html( self::INTRODUCTION_NOTICE ); ?>" class="modal-content-wrap">
					<div class="video-wrapper">
						<iframe width="480" height="270" src="https://www.youtube.com/embed/MLpWrANjFbI?si=NugoZlkXwil9ya9P" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
					</div>
					<h2 style="color: #0C0D0E;font-family: Roboto;font-size: 24px;font-style: normal;font-weight: 700;line-height: 133.4%;"><?php esc_html_e( 'Switch to our new accessibility widget', 'pojo-accessibility' ); ?></h2>
					<p><?php esc_html_e( '{{appName}} by Elementor is our new and improved accessibility widget. Get advanced customization, control, and customer support with one simple switch.', 'pojo-accessibility' ); ?></p>
					<div>
						<ul class="benefits">
							<li>
								<?php esc_html_e( 'Personalize colors, styles, and layouts to match your brand', 'pojo-accessibility' ); ?>
							</li>
							<li>
								<?php esc_html_e( 'Decide and manage which features you want displayed', 'pojo-accessibility' ); ?>
							</li>
							<li><?php esc_html_e( 'Create or add your Accessibility Statement instantly', 'pojo-accessibility' ); ?></li>
						</ul>
					</div>
					<a href="<?php echo esc_url( self::get_learn_more_link() ); ?>"><?php esc_html_e( 'Learn more about the changes', 'pojo-accessibility' ); ?></a>
					<div class="footer-actions">
						<a href="#" class="close-button"><?php esc_html_e( 'Not now' ); ?></a>
						<a href="<?php echo esc_url( self::get_switch_now_link() ); ?>" class="button button-primary"><?php esc_html_e( 'Switch now', 'pojo-accessibility' ); ?></a>
					</div>
				</div>
			</div>
			<script>
				const localStorageKey = '<?php echo esc_js( self::INTRODUCTION_NOTICE ); ?>';
				const onLoad = ( callback ) => {
					if ( document.readyState !== 'loading' ) {
						callback();
					} else if ( document.addEventListener ) {
						document.addEventListener( 'DOMContentLoaded', () => callback() );
					} else {
						document.attachEvent( 'onreadystatechange', () => {
							if ( document?.readyState=='complete' ) {
								callback();
							}
						});
					}
				};
				onLoad(
					() => setTimeout( () => {
						const stored = window.localStorage.getItem( localStorageKey );
						if ( stored && new Date().getTime() - parseInt( stored ) < 1000 * 60 * 60 * 24 * 7 ) {
							return;
						}
						const $modal = document.querySelector( `[data-modal-slug="${localStorageKey}"]` );
						tb_show( '', `/?TB_inline&inlineId=${localStorageKey}&height=620&width=480&modal=true` );
						const closeButton = $modal.querySelector( 'a.close-button' );
						const close = () => {
							tb_remove();
							closeButton.removeEventListener( 'click', close );
						};

						closeButton.addEventListener( 'click',  (e) => {
							e.preventDefault();
							window.localStorage.setItem( localStorageKey, new Date().getTime().toString() );
							close();
						} );
					}, 100 )
				);
			</script>
			<style>
				.video-wrapper {
					position: relative;
					padding-bottom: 56.25%;
					padding-top: 25px;
					height: 0;
					overflow: hidden;
				}
				.modal-content-wrap {
					padding: 0 9px;
				}
				.benefits li{
					list-style-image: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJDaXJjbGVDaGVja0ZpbGxlZCI+CjxwYXRoIGlkPSJWZWN0b3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgMS44NzVDOC45MzMwMSAxLjg3NSA3Ljg3NjQ3IDIuMDg1MTYgNi44OTA3IDIuNDkzNDhDNS45MDQ5MyAyLjkwMTggNS4wMDkyMyAzLjUwMDI4IDQuMjU0NzYgNC4yNTQ3NkMzLjUwMDI4IDUuMDA5MjMgMi45MDE4IDUuOTA0OTMgMi40OTM0OCA2Ljg5MDdDMi4wODUxNiA3Ljg3NjQ3IDEuODc1IDguOTMzMDEgMS44NzUgMTBDMS44NzUgMTEuMDY3IDIuMDg1MTYgMTIuMTIzNSAyLjQ5MzQ4IDEzLjEwOTNDMi45MDE4IDE0LjA5NTEgMy41MDAyOCAxNC45OTA4IDQuMjU0NzYgMTUuNzQ1MkM1LjAwOTIzIDE2LjQ5OTcgNS45MDQ5MyAxNy4wOTgyIDYuODkwNyAxNy41MDY1QzcuODc2NDcgMTcuOTE0OCA4LjkzMzAxIDE4LjEyNSAxMCAxOC4xMjVDMTEuMDY3IDE4LjEyNSAxMi4xMjM1IDE3LjkxNDggMTMuMTA5MyAxNy41MDY1QzE0LjA5NTEgMTcuMDk4MiAxNC45OTA4IDE2LjQ5OTcgMTUuNzQ1MiAxNS43NDUyQzE2LjQ5OTcgMTQuOTkwOCAxNy4wOTgyIDE0LjA5NTEgMTcuNTA2NSAxMy4xMDkzQzE3LjkxNDggMTIuMTIzNSAxOC4xMjUgMTEuMDY3IDE4LjEyNSAxMEMxOC4xMjUgOC45MzMwMSAxNy45MTQ4IDcuODc2NDcgMTcuNTA2NSA2Ljg5MDdDMTcuMDk4MiA1LjkwNDkzIDE2LjQ5OTcgNS4wMDkyMyAxNS43NDUyIDQuMjU0NzZDMTQuOTkwOCAzLjUwMDI4IDE0LjA5NTEgMi45MDE4IDEzLjEwOTMgMi40OTM0OEMxMi4xMjM1IDIuMDg1MTYgMTEuMDY3IDEuODc1IDEwIDEuODc1Wk0xMy41MzQ2IDguMzgwMjRDMTMuNzc4NyA4LjEzNjE2IDEzLjc3ODcgNy43NDA0MyAxMy41MzQ2IDcuNDk2MzVDMTMuMjkwNSA3LjI1MjI4IDEyLjg5NDggNy4yNTIyOCAxMi42NTA3IDcuNDk2MzVMOC45NjkyNSAxMS4xNzc4TDcuMzQ5NDkgOS41NTgwNUM3LjEwNTQyIDkuMzEzOTggNi43MDk2OSA5LjMxMzk4IDYuNDY1NjEgOS41NTgwNUM2LjIyMTUzIDkuODAyMTMgNi4yMjE1MyAxMC4xOTc5IDYuNDY1NjEgMTAuNDQxOUw4LjUyNzMxIDEyLjUwMzZDOC42NDQ1MiAxMi42MjA4IDguODAzNDkgMTIuNjg2NyA4Ljk2OTI1IDEyLjY4NjdDOS4xMzUwMSAxMi42ODY3IDkuMjkzOTggMTIuNjIwOCA5LjQxMTE5IDEyLjUwMzZMMTMuNTM0NiA4LjM4MDI0WiIgZmlsbD0iIzI1NjNFQiIvPgo8L2c+Cjwvc3ZnPgo=');/
				}
				li::marker{
					font-size: 1.5em;
					line-height: 0.1em;
				}
				.footer-actions {
					display: flex;
					gap: 20px;
					justify-content: end;
					padding: 24px;
				}
			</style>
			<?php
		});
	}

	public function maybe_add_confirmation_modal() {
		// only show to admins on legacy pages and to admin users
		if ( ! $this->is_legacy_page() || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! isset( $_GET[ self::CONFIRMATION_MODAL ] ) ) {
			return;
		}

		$this->disable_introduction_modal = true;

		add_thickbox();
		wp_enqueue_script( 'jquery' );
		add_action( 'admin_footer', function() {
			?>
			<div  id="<?php echo esc_html( self::CONFIRMATION_MODAL ); ?>" style="display:none;">
				<div data-modal-slug="<?php echo esc_html( self::CONFIRMATION_MODAL ); ?>" class="modal-content-wrap">
					<div>add icons here!!!</div>
					<h2 style="color: #0C0D0E;font-family: Roboto;font-size: 24px;font-style: normal;font-weight: 700;line-height: 133.4%;"><?php esc_html_e( 'Confirm switching to {{appName}}', 'pojo-accessibility' ); ?></h2>
					<p><?php esc_html_e( 'You’re about to switch from {{oldApp}}, which we no longer support, to  {{appName}} by Elementor. Any previous settings will be removed, and this action cannot be undone.', 'pojo-accessibility' ); ?></p>
					<div class="footer-actions">
						<a href="#" class="close-button"><?php esc_html_e( 'Keep Current' ); ?></a>
						<a href="<?php echo esc_url( self::get_switch_now_link() ); ?>" class="button button-primary upgrade-now"><?php esc_html_e( 'Confirm and switch', 'pojo-accessibility' ); ?></a>
					</div>
				</div>
			</div>
			<script>
				const modalID = '<?php echo esc_js( self::CONFIRMATION_MODAL ); ?>';
				const onLoad = ( callback ) => {
					if ( document.readyState !== 'loading' ) {
						callback();
					} else if ( document.addEventListener ) {
						document.addEventListener( 'DOMContentLoaded', () => callback() );
					} else {
						document.attachEvent( 'onreadystatechange', () => {
							if ( document?.readyState === 'complete' ) {
								callback();
							}
						});
					}
				};
				onLoad(
					() => setTimeout( () => {
						const modal = document.querySelector( `[data-modal-slug="${ modalID }"]` );
						tb_show( '', `/?TB_inline&inlineId=${ modalID }&height=320&width=552&modal=true` );
						const closeButton = modal.querySelector( 'a.close-button' );
						const upgradeButton = modal.querySelector( 'a.upgrade-now' );
						const close = () => {
							tb_remove();
							closeButton.removeEventListener( 'click', close );
						};

						closeButton.addEventListener( 'click', ( e ) => {
							e.preventDefault();
							close();
						} );

						upgradeButton.addEventListener( 'click', ( e ) => {
							e.preventDefault();
							fetch( ajaxurl, {
								method: 'POST',
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
								body: new URLSearchParams( {
									action: '<?php echo esc_js( self::AJAX_ACTION ); ?>',
									nonce: '<?php echo esc_js( wp_create_nonce( self::AJAX_ACTION ) ); ?>',
								} ).toString(),
							} ).then( ( response ) => {
								if ( response.ok ) {
									close();
									location.href = '<?php echo esc_js( admin_url( 'options-general.php?page=' . Config::ADMIN_PAGE ) ); ?>';
								}
							} );
						} );

					} ), 100 );

			</script>
			<style>
				.modal-content-wrap {
					padding: 0 9px;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				.footer-actions {
					display: flex;
					gap: 20px;
					justify-content: end;
					padding: 24px;
				}
			</style>
			<?php
		}, 1000);
	}

	/**
	 * register_notices
	 *
	 * @param Notices $notice_manager
	 */
	public function register_notices( Notices $notice_manager ) {
		$notices = [
			'Sticky_Deprecated_Nag',
			'Dismissible_Deprecated_Nag',
		];

		foreach ( $notices as $notice ) {
			$class_name = 'EA11y\Modules\Legacy\Notices\\' . $notice;
			$notice_manager->register_notice( new $class_name() );
		}
	}

	/**
	 * handle_ajax_upgrade
	 */
	public function handle_ajax_upgrade() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => 'Unauthorized' ] );
		}

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['nonce'] ) ), self::AJAX_ACTION ) ) {
			wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
		}

		self::upgrade();
		wp_send_json_success( [] );
	}

	/**
	 * maybe_render_pointer
	 */
	public function maybe_render_pointer() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( $this->is_legacy_page() ) {
			return;
		}

		if ( Pointers::is_dismissed( self::AJAX_ACTION ) ) {
			return;
		}


		wp_enqueue_script( 'wp-pointer' );
		wp_enqueue_style( 'wp-pointer' );

		$pointer_content = '<h3>' . esc_html__( 'Accessibility', 'pojo-accessibility' ) . '</h3>';
		$pointer_content .= '<p>' . esc_html__( "Our new, improved accessibility widget is now available! {{appName}} is packed with advanced styling options, improved feature controls, and so much more. ", 'pojo-accessibility' ) . '</p>';

		$pointer_content .= sprintf(
			'<p><a class="button button-primary ea11y-pointer-settings-link" href="%s">%s</a></p>',
			self::get_switch_now_link(),
			esc_html__( 'View more details', 'pojo-accessibility' )
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
						pointer: '<?php echo esc_attr( self::AJAX_ACTION ); ?>',
					},
					nonce: '<?php echo esc_attr( wp_create_nonce( 'ea11y-pointer-dismissed' ) ); ?>',
				} );
			}

			jQuery( document ).ready( function( $ ) {
				//TODO: Update page URL
				$( '#<?php echo Settings::SETTINGS_PAGE; ?>' ).pointer( {
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

	/**
	 * Upgrade constructor.
	 */
	public function __construct() {
		// Upgrade Pointer
		add_action( 'admin_footer', [ $this, 'maybe_render_pointer' ] );
		// upgrade confirmation modal has to be before introduction modal
		add_action( 'current_screen', [ $this, 'maybe_add_confirmation_modal' ], 9 );
		// Introduction modal
		add_action( 'current_screen', [ $this, 'maybe_add_introduction_modal' ] );
		// Add customizer notification
		add_filter( 'pojo_a11y_customizer_section_description', [ $this, 'add_deprecated_notice_to_customizer_section_description' ] );
		// Register notices
		add_action( 'ea11y_register_notices', [ $this, 'register_notices' ] );
		// Upgrade
		add_action( 'wp_ajax_' . self::AJAX_ACTION, [ $this, 'handle_ajax_upgrade' ] );
	}
}
