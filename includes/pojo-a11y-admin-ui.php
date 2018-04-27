<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Pojo_A11y_Admin_UI {

	const SETTINGS_SLUG = 'toplevel_page_accessibility-settings';
	const TOOLBAR_SLUG = 'accessibility_page_accessibility-toolbar';

	private function _is_elementor_installed() {
		$file_path = 'elementor/elementor.php';
		$installed_plugins = get_plugins();
		return isset( $installed_plugins[ $file_path ] );
	}

	public function ajax_a11y_install_elementor_set_admin_notice_viewed() {
		update_user_meta( get_current_user_id(), '_a11y_elementor_install_notice', 'true' );
	}

	public function admin_notices() {
		if ( ! current_user_can( 'install_plugins' ) || $this->_is_elementor_installed() ) {
			return;
		}

		if ( 'true' === get_user_meta( get_current_user_id(), '_a11y_elementor_install_notice', true ) ) {
			return;
		}

		if ( ! in_array( get_current_screen()->id, array( self::SETTINGS_SLUG, self::TOOLBAR_SLUG, 'dashboard', 'plugins', 'plugins-network' ) ) ) {
			return;
		}
		add_action( 'admin_footer', array( &$this, 'print_js' ) );
		$install_url = self_admin_url( 'plugin-install.php?tab=search&s=elementor' );
		?>
		<style>
			.notice.a11y-notice {
				border-left-color: #9b0a46 !important;
				padding: 20px;
			}
			.rtl .notice.a11y-notice {
				border-right-color: #9b0a46 !important;
			}
			.notice.a11y-notice .a11y-notice-inner {
				display: table;
				width: 100%;
			}
			.notice.a11y-notice .a11y-notice-inner .a11y-notice-icon,
			.notice.a11y-notice .a11y-notice-inner .a11y-notice-content,
			.notice.a11y-notice .a11y-notice-inner .a11y-install-now {
				display: table-cell;
				vertical-align: middle;
			}
			.notice.a11y-notice .a11y-notice-icon {
				color: #9b0a46;
				font-size: 50px;
				width: 50px;
			}
			.notice.a11y-notice .a11y-notice-content {
				padding: 0 20px;
			}
			.notice.a11y-notice p {
				padding: 0;
				margin: 0;
			}
			.notice.a11y-notice h3 {
				margin: 0 0 5px;
			}
			.notice.a11y-notice .a11y-install-now {
				text-align: center;
			}
			.notice.a11y-notice .a11y-install-now .a11y-install-button {
				background-color: #9b0a46;
				color: #fff;
				border-color: #7c1337;
				box-shadow: 0 1px 0 #7c1337;
				padding: 5px 30px;
				height: auto;
				line-height: 20px;
				text-transform: capitalize;
			}
			.notice.a11y-notice .a11y-install-now .a11y-install-button i {
				padding-right: 5px;
			}
			.rtl .notice.a11y-notice .a11y-install-now .a11y-install-button i {
				padding-right: 0;
				padding-left: 5px;
			}
			.notice.a11y-notice .a11y-install-now .a11y-install-button:hover {
				background-color: #a0124a;
			}
			.notice.a11y-notice .a11y-install-now .a11y-install-button:active {
				box-shadow: inset 0 1px 0 #7c1337;
				transform: translateY(1px);
			}
			@media (max-width: 767px) {
				.notice.a11y-notice {
					padding: 10px;
				}
				.notice.a11y-notice .a11y-notice-inner {
					display: block;
				}
				.notice.a11y-notice .a11y-notice-inner .a11y-notice-content {
					display: block;
					padding: 0;
				}
				.notice.a11y-notice .a11y-notice-inner .a11y-notice-icon,
				.notice.a11y-notice .a11y-notice-inner .a11y-install-now {
					display: none;
				}
			}
		</style>
		<div class="notice updated is-dismissible a11y-notice a11y-install-elementor">
			<div class="a11y-notice-inner">
				<div class="a11y-notice-icon">
					<img src="<?php echo POJO_A11Y_ASSETS_URL; ?>images/elementor-logo.png" alt="Elementor Logo" />
				</div>

				<div class="a11y-notice-content">
					<h3><?php esc_html_e( 'Do You Like One Click Accessibility? You\'ll Love Elementor!', 'pojo-accessibility' ); ?></h3>
					<p><?php esc_html_e( 'Create high-end, pixel perfect websites at record speeds. Any theme, any page, any design. The most advanced frontend drag & drop page builder.', 'pojo-accessibility' ); ?>
						<a href="https://elementor.com/?utm_source=accessibility&utm_medium=wp-dash&utm_campaign=notice" target="_blank"><?php esc_html_e( 'Learn more about Elementor', 'pojo-accessibility' ); ?></a>.</p>
				</div>

				<div class="a11y-install-now">
					<a class="button a11y-install-button" href="<?php echo $install_url; ?>"><i class="dashicons dashicons-download"></i><?php esc_html_e( 'Install Now For Free!', 'pojo-accessibility' ); ?></a>
				</div>
			</div>
		</div>
		<?php
	}

	public function print_js() {
		?>
		<script>jQuery( function( $ ) {
				$( 'div.notice.a11y-install-elementor' ).on( 'click', 'button.notice-dismiss', function( event ) {
					event.preventDefault();
					$.post( ajaxurl, {
						action: 'a11y_install_elementor_set_admin_notice_viewed'
					} );
				} );
			} );</script>
		<?php
	}

	public function admin_footer_text( $footer_text ) {
		$current_screen = get_current_screen();
		if ( in_array( $current_screen->id, array( self::SETTINGS_SLUG, self::TOOLBAR_SLUG ) ) ) {
			$footer_text = sprintf(
				/* translators: 1: One Click Accessibility, 2: Link to plugin review */
				__( 'Enjoyed %1$s? Please leave us a %2$s rating. We really appreciate your support!', 'pojo-accessibility' ),
				'<strong>' . __( 'One Click Accessibility', 'pojo-accessibility' ) . '</strong>',
				'<a href="https://wordpress.org/support/plugin/pojo-accessibility/reviews/?filter=5#new-post" target="_blank">&#9733;&#9733;&#9733;&#9733;&#9733;</a>'
			);
		}

		return $footer_text;
	}

	public function __construct() {
		add_action( 'admin_notices', array( &$this, 'admin_notices' ) );
		add_action( 'wp_ajax_a11y_install_elementor_set_admin_notice_viewed', array( &$this, 'ajax_a11y_install_elementor_set_admin_notice_viewed' ) );
		add_filter( 'admin_footer_text', [ $this, 'admin_footer_text' ] );
	}
}
