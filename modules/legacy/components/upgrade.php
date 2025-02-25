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
	const REVERTED_OPTION = 'ea11y_reverted';
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
		delete_option( self::REVERTED_OPTION );
	}

	/**
	 * revert
	 */
	public static function revert() : void {
		update_option( self::REVERTED_OPTION, true );
		delete_option( self::UPGRADED_OPTION );
	}

	/**
	 * has_legacy_data
	 * used to check if the user has any legacy data stored
	 * @return bool
	 */
	public static function has_legacy_data() : bool {
		$options = [
			'pojo_a11y_customizer_options',
			'pojo_a11y_focusable',
			'pojo_a11y_skip_to_content_link',
			'pojo_a11y_skip_to_content_link_element_id',
			'pojo_a11y_remove_link_target',
			'pojo_a11y_add_role_links',
			'pojo_a11y_save',
			'pojo_a11y_save_expiration',
			'pojo_a11y_toolbar_title',
			'pojo_a11y_toolbar_button_resize_font',
			'pojo_a11y_toolbar_button_resize_font_add_title',
			'pojo_a11y_toolbar_button_resize_font_less_title',
			'pojo_a11y_toolbar_button_grayscale',
			'pojo_a11y_toolbar_button_grayscale_title',
			'pojo_a11y_toolbar_button_high_contrast',
			'pojo_a11y_toolbar_button_high_contrast_title',
			'pojo_a11y_toolbar_button_negative_contrast',
			'pojo_a11y_toolbar_button_negative_contrast_title',
			'pojo_a11y_toolbar_button_light_bg',
			'pojo_a11y_toolbar_button_light_bg_title',
			'pojo_a11y_toolbar_button_links_underline',
			'pojo_a11y_toolbar_button_links_underline_title',
			'pojo_a11y_toolbar_button_readable_font',
			'pojo_a11y_toolbar_button_readable_font_title',
			'pojo_a11y_toolbar_button_sitemap_title',
			'pojo_a11y_toolbar_button_sitemap_link',
			'pojo_a11y_toolbar_button_help_title',
			'pojo_a11y_toolbar_button_help_link',
			'pojo_a11y_toolbar_button_feedback_title',
			'pojo_a11y_toolbar_button_feedback_link',
		];
		foreach ( $options as $option ) {
			if ( get_option( $option, false ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * is_upgraded
	 * @return bool
	 */
	public static function is_upgraded() : bool {
		return (bool) get_option( self::UPGRADED_OPTION, false );
	}

	/**
	 * is_reverted
	 * @return bool
	 */
	public static function is_reverted() : bool {
		return (bool) get_option( self::REVERTED_OPTION, false );
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
	 *
	 * @param $campaign
	 *
	 * @return string
	 */
	public static function get_learn_more_link( $campaign ) : string {
		return add_query_arg([
			'utm_source' => 'acc-switch',
			'utm_medium' => 'wp-dash',
			'utm_campaign' => $campaign,
		], 'https://go.elementor.com/acc-notice-switch-oc/' );
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
			'<p>%s</p><p><a href="%s">%s</a></p><p><a class="button" href="%s">%s</a></p>',
			esc_html__( 'New! Switch to our updated accessibility widget for better features and control.', 'pojo-accessibility' ),
			self::get_learn_more_link( 'acc-notice-switch-custom' ),
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
						<iframe
								width="480"
								height="270"
								src="https://www.youtube.com/embed/p-vVS5FXL_A?si=DL6RshUJot749xJ5&amp;controls=0"
								title="YouTube video player"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
						></iframe>
					</div>
					<h2 class="intro-title"><?php esc_html_e( 'Switch to our new accessibility widget', 'pojo-accessibility' ); ?></h2>
					<p class="intro-description typography-body1"><?php esc_html_e( 'Ally - Web Accessibility is our new and improved accessibility plugin. Get advanced customization, control, and customer support with one simple switch.', 'pojo-accessibility' ); ?></p>
					<div>
						<ul class="benefits typography-body1">
							<li>
								<?php esc_html_e( 'Personalize colors, styles, and layouts to match your brand', 'pojo-accessibility' ); ?>
							</li>
							<li>
								<?php esc_html_e( 'Decide and manage which features you want displayed', 'pojo-accessibility' ); ?>
							</li>
							<li><?php esc_html_e( 'Create or add your Accessibility Statement instantly', 'pojo-accessibility' ); ?></li>
						</ul>
					</div>
					<a class="intro-learn-more no-underline typography-body1" href="<?php echo esc_url( self::get_learn_more_link( 'acc-popup-switch-oc' ) ); ?>"><?php esc_html_e( 'Learn more about the changes', 'pojo-accessibility' ); ?></a>
					<div class="footer-actions">
						<a href="#" class="close-button no-underline"><?php esc_html_e( 'Not now', 'pojo-accessibility' ); ?></a>
						<a href="<?php echo esc_url( self::get_switch_now_link() ); ?>" class="button button-primary switch-now"><?php esc_html_e( 'Switch to Ally', 'pojo-accessibility' ); ?></a>
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
							if ( document?.readyState === 'complete' ) {
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
						tb_show( '', `/?TB_inline&inlineId=${localStorageKey}&height=650&width=480&modal=true` );
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
				/* Basic components */
				.typography-body1 {
					font-family: Roboto, sans-serif;
					font-size: 16px;
					font-style: normal;
					font-weight: 400;
					letter-spacing: 0.15px;
				}

				/* Modal CSS */
				#TB_window {
					border-radius: 4px;
				}
				.video-wrapper {
					position: relative;
					padding-bottom: 56.25%;
					padding-top: 9px;
					height: 0;
					overflow: hidden;
				}
				.modal-content-wrap {
					padding: 1px 9px;
				}
				.intro-title {
					margin-top: 16px;
					font-family: Roboto, sans-serif;
					font-size: 24px;
					font-style: normal;
					font-weight: 700;
					line-height: 133.4%;
				}
				.intro-description{
					padding: 0 !important;
					margin-top: 24px;
					margin-bottom: 24px;
					color: #69727D;
				}
				.benefits {
					margin: 24px 0;
				}
				.benefits li{
					color: #69727D;
					background-image: url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJDaXJjbGVDaGVja0ZpbGxlZCI+CjxwYXRoIGlkPSJWZWN0b3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgMS44NzVDOC45MzMwMSAxLjg3NSA3Ljg3NjQ3IDIuMDg1MTYgNi44OTA3IDIuNDkzNDhDNS45MDQ5MyAyLjkwMTggNS4wMDkyMyAzLjUwMDI4IDQuMjU0NzYgNC4yNTQ3NkMzLjUwMDI4IDUuMDA5MjMgMi45MDE4IDUuOTA0OTMgMi40OTM0OCA2Ljg5MDdDMi4wODUxNiA3Ljg3NjQ3IDEuODc1IDguOTMzMDEgMS44NzUgMTBDMS44NzUgMTEuMDY3IDIuMDg1MTYgMTIuMTIzNSAyLjQ5MzQ4IDEzLjEwOTNDMi45MDE4IDE0LjA5NTEgMy41MDAyOCAxNC45OTA4IDQuMjU0NzYgMTUuNzQ1MkM1LjAwOTIzIDE2LjQ5OTcgNS45MDQ5MyAxNy4wOTgyIDYuODkwNyAxNy41MDY1QzcuODc2NDcgMTcuOTE0OCA4LjkzMzAxIDE4LjEyNSAxMCAxOC4xMjVDMTEuMDY3IDE4LjEyNSAxMi4xMjM1IDE3LjkxNDggMTMuMTA5MyAxNy41MDY1QzE0LjA5NTEgMTcuMDk4MiAxNC45OTA4IDE2LjQ5OTcgMTUuNzQ1MiAxNS43NDUyQzE2LjQ5OTcgMTQuOTkwOCAxNy4wOTgyIDE0LjA5NTEgMTcuNTA2NSAxMy4xMDkzQzE3LjkxNDggMTIuMTIzNSAxOC4xMjUgMTEuMDY3IDE4LjEyNSAxMEMxOC4xMjUgOC45MzMwMSAxNy45MTQ4IDcuODc2NDcgMTcuNTA2NSA2Ljg5MDdDMTcuMDk4MiA1LjkwNDkzIDE2LjQ5OTcgNS4wMDkyMyAxNS43NDUyIDQuMjU0NzZDMTQuOTkwOCAzLjUwMDI4IDE0LjA5NTEgMi45MDE4IDEzLjEwOTMgMi40OTM0OEMxMi4xMjM1IDIuMDg1MTYgMTEuMDY3IDEuODc1IDEwIDEuODc1Wk0xMy41MzQ2IDguMzgwMjRDMTMuNzc4NyA4LjEzNjE2IDEzLjc3ODcgNy43NDA0MyAxMy41MzQ2IDcuNDk2MzVDMTMuMjkwNSA3LjI1MjI4IDEyLjg5NDggNy4yNTIyOCAxMi42NTA3IDcuNDk2MzVMOC45NjkyNSAxMS4xNzc4TDcuMzQ5NDkgOS41NTgwNUM3LjEwNTQyIDkuMzEzOTggNi43MDk2OSA5LjMxMzk4IDYuNDY1NjEgOS41NTgwNUM2LjIyMTUzIDkuODAyMTMgNi4yMjE1MyAxMC4xOTc5IDYuNDY1NjEgMTAuNDQxOUw4LjUyNzMxIDEyLjUwMzZDOC42NDQ1MiAxMi42MjA4IDguODAzNDkgMTIuNjg2NyA4Ljk2OTI1IDEyLjY4NjdDOS4xMzUwMSAxMi42ODY3IDkuMjkzOTggMTIuNjIwOCA5LjQxMTE5IDEyLjUwMzZMMTMuNTM0NiA4LjM4MDI0WiIgZmlsbD0iIzI1NjNFQiIvPgo8L2c+Cjwvc3ZnPgo=);
					background-repeat: no-repeat;
					padding: 0 0 0 25px;
					margin-bottom: 8px;
				}
				li::marker{
					font-size: 1.5em;
					line-height: 0.1em;
				}
				.intro-learn-more{
					color: #2563EB !important;
				}
				.intro-learn-more:hover{
					color: #1D4ED8 !important;
				}
				.footer-actions {
					display: flex;
					gap: 20px;
					justify-content: end;
					align-items: center;
					padding: 16px 0 1px 0;
					margin-top: 32px;
				}
				.close-button {
					font-family: Roboto, sans-serif;
					font-size: 15px;
					font-style: normal;
					font-weight: 500;
					line-height: 24px;
					letter-spacing: 0.4px;
					color: #515962;
				}
				.switch-now {
					background: #2563EB !important;
					border-radius: 4px;
					font-family: Roboto, sans-serif;
					font-size: 15px !important;
					font-style: normal;
					font-weight: 500;
					letter-spacing: 0.4px;
					padding: 3px 16px !important; /* Override WordPress CSS */
				}
				.switch-now:hover, .switch-now:active {
					background: #1D4ED8 !important;
				}
				.no-underline {
					text-decoration: none;
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
					<div class="top-icons">
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
								<path d="M21.3076 0.6497C15.8994 1.27144 10.9435 3.64535 7.06171 7.50766C3.50023 11.0497 1.1636 15.4584 0.29679 20.3192C-0.0989299 22.5424 -0.0989299 26.5743 0.29679 28.7975C2.04926 38.5757 9.92596 46.4511 19.7059 48.2033C21.9295 48.5989 25.962 48.5989 28.1856 48.2033C33.0473 47.3366 37.4567 45.0004 40.9994 41.4395C47.802 34.5815 49.8559 24.5207 46.2379 15.5337C42.2619 5.62361 31.9355 -0.556095 21.3076 0.6497ZM25.2648 12.2178C26.9419 13.0845 27.2246 15.2134 25.8301 16.5511C25.3779 16.9845 25.0575 17.1163 24.1719 17.1729C23.1355 17.2482 23.0224 17.2105 22.3817 16.6642C20.893 15.3453 21.0438 13.3106 22.6832 12.312C23.3993 11.8598 24.5111 11.8222 25.2648 12.2178ZM17.162 17.512C21.5149 17.8888 26.3577 17.8888 31.1441 17.4932C34.7809 17.1917 35.1013 17.1917 35.5347 17.4743C36.1377 17.87 36.1942 18.9062 35.6477 19.4526C35.2143 19.8859 34.9505 19.9424 31.389 20.3004C29.1089 20.5453 28.7132 20.6395 28.4306 20.9975C28.1102 21.3555 28.0914 22.0337 28.0914 28.7598C28.0914 36.0511 28.0914 36.1265 27.6768 36.5598C27.168 37.1062 26.1693 37.1439 25.6605 36.6352C25.246 36.2207 25.1706 35.7497 24.8879 32.3772C24.643 29.4192 24.5864 29.1555 24.2284 29.0236C23.6254 28.7786 23.437 29.3815 23.2108 32.3207C22.9282 35.6743 22.7586 36.541 22.2498 36.8047C21.6656 37.1062 20.893 37.012 20.422 36.5786L19.9885 36.183V28.7786C19.9885 22.0337 19.9697 21.3555 19.6682 20.9975C19.3667 20.6395 18.9521 20.5453 16.0314 20.2439C13.1106 19.9236 12.7148 19.8482 12.4133 19.4714C11.9799 18.9439 11.9799 18.0019 12.3945 17.5497C12.7714 17.1352 13.0163 17.1352 17.162 17.512Z" fill="black"/>
							</svg>
						</div>
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="9" viewBox="0 0 37 9" fill="none">
								<path d="M36.3536 4.85355C36.5488 4.65829 36.5488 4.34171 36.3536 4.14645L33.1716 0.964466C32.9763 0.769204 32.6597 0.769204 32.4645 0.964466C32.2692 1.15973 32.2692 1.47631 32.4645 1.67157L35.2929 4.5L32.4645 7.32843C32.2692 7.52369 32.2692 7.84027 32.4645 8.03553C32.6597 8.2308 32.9763 8.2308 33.1716 8.03553L36.3536 4.85355ZM0 5H36V4H0V5Z" fill="#69727D"/>
							</svg>
						</div>
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none">
								<rect width="48" height="48" rx="24" fill="#FF7BE5"/>
								<path d="M23.886 16.529a2.954 2.954 0 1 0 0-5.908 2.954 2.954 0 0 0 0 5.908Z" fill="#fff"/>
								<path d="M28.223 17.35c-2.91.304-5.858.296-8.848 0l-6.585-1.035a1.717 1.717 0 0 0-1.773 1.716c0 .93.584 1.593 1.666 1.716l7.482.986-.615 15.28a1.57 1.57 0 0 0 3.137.118l.495-6.555a.79.79 0 0 1 1.579 0l.495 6.555a1.57 1.57 0 0 0 3.137-.117l-.547-13.458c0-.984.782-1.792 1.765-1.825l5.473-.984c1.09-.194 1.667-.787 1.667-1.716 0-.973-.803-1.749-1.773-1.719l-6.763 1.036.008.003Z" fill="#fff"/>
								<path d="m16.889 21.437-3.132-1.53c6.826.773 7.493 1.142 10.64 1.21-3.251.178-6.101.555-7.508.318v.002Z" fill="#FF7BE5"/>
							</svg>
						</div>
					</div>
					<h2 class="confirmation-title"><?php esc_html_e( 'Confirm switching to Ally', 'pojo-accessibility' ); ?></h2>
					<p class="confirmation-description"><?php esc_html_e( 'You’re about to switch from One click accessibility, which we no longer support, to Ally - Web Accessibility. Any previous settings will be removed, and this action cannot be undone.', 'pojo-accessibility' ); ?></p>
					<div class="footer-actions">
						<a href="#" class="close-button no-underline"><?php esc_html_e( 'Keep Current', 'pojo-accessibility' ); ?></a>
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
						tb_show( '', `/?TB_inline&inlineId=${ modalID }&height=330&width=552&modal=true` );
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
									location.href = '<?php echo esc_js( admin_url( 'admin.php?page=' . Config::ADMIN_PAGE ) ); ?>';
								}
							} );
						} );

					} ), 100 );

			</script>
			<style>
				#TB_window {
					border-radius: 4px;
				}
				.no-underline {
					text-decoration: none;
				}
				.modal-content-wrap {
					padding: 0 9px;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				.confirmation-title {
					font-family: Roboto, sans-serif !important;
					font-size: 24px;
					font-style: normal;
					font-weight: 700;
					line-height: 133.4%;
					margin-block: 1px;
					margin-bottom: 9px
				}
				.confirmation-description{
					font-family: Roboto, sans-serif;
					font-size: 16px;
					font-style: normal;
					font-weight: 500;
					letter-spacing: 0.15px;
					text-align: center;
					color: #69727D;
				}
				.top-icons {
					display: flex;
					width: 150px;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					row-gap: 1px;
					flex-wrap: wrap;
					margin-block: 25px;
				}
				.footer-actions {
					display: flex;
					gap: 20px;
					justify-content: end;
					align-items: center;
					width: 100%;
					margin-top: 16px;
				}
				.upgrade-now {
					background: #2563EB !important;
					border-radius: 4px;
					font-family: Roboto, sans-serif;
					font-size: 15px !important;
					font-style: normal;
					font-weight: 500;
					line-height: 24px;
					letter-spacing: 0.4px;
					padding: 3px 16px !important;
				}
				.upgrade-now:hover, .upgrade-now:active {
					background: #1D4ED8 !important;
				}
				.close-button {
					font-family: Roboto, sans-serif;
					font-size: 15px;
					font-style: normal;
					font-weight: 500;
					line-height: 24px; /* 160% */
					letter-spacing: 0.4px;
					color: #515962;
				}
				.close-button:hover, .close-button:active {
					color: #1D4ED8;
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

		// store upgrade campaign data
		$campaign_data = [
			'source' => 'one-click-upgrade',
			'campaign' => 'a11y-upgrade',
			'medium' => 'wp-dash',
		];

		set_transient( 'elementor_ea11y_campaign', $campaign_data, 30 * DAY_IN_SECONDS );

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
		$pointer_content .= '<p>' . esc_html__( 'Our new, improved accessibility plugin is now available! Ally - Web Accessibility is packed with advanced styling options, improved feature controls, and so much more.', 'pojo-accessibility' ) . '</p>';

		$pointer_content .= sprintf(
			'<p><a class="button button-primary ea11y-pointer-settings-link" href="%s">%s</a></p>',
			admin_url( 'admin.php?page=accessibility-settings' ),
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
				$( '#<?php echo esc_html( Settings::SETTINGS_PAGE ); ?>' ).pointer( {
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
				background-size: contain;
				background-image: url("<?php echo esc_url( EA11Y_ASSETS_URL . 'images/logo.svg' ); ?>");
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
