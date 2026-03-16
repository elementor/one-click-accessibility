<?php

namespace EA11y\Modules\Core\Components;

use DateTime;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Settings\Module as SettingsModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Renewal_Notice {
	const RENEWAL_NOTICE_SLUG = 'ea11y-renewal-notice';

	public ?int $days_diff = null;

	public function date_diff_from_current( $date ) {
		$current_date = new DateTime(); // Current date
		$given_date = new DateTime( $date );

		$interval = $current_date->diff( $given_date );

		$this->days_diff = $interval->invert ? -$interval->days : $interval->days;

		return $this->days_diff;
	}

	private function get_notice_icon( $type ) {
		if ( $type === 'warning' ) {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M8.99377 0.75C8.54331 0.75 8.10108 0.870399 7.71304 1.09868C7.32712 1.32571 7.00882 1.65121 6.79083 2.04164L0.283328 13.245C0.26729 13.2726 0.253202 13.3013 0.241167 13.3309C0.0897885 13.7027 0.0297608 14.1054 0.0660952 14.5051C0.10243 14.9048 0.234072 15.2901 0.450032 15.6287C0.665991 15.9674 0.960002 16.2495 1.30752 16.4517C1.65503 16.6538 2.04597 16.7701 2.44769 16.7907C2.47676 16.7922 2.50551 16.7919 2.53382 16.7899C2.55038 16.791 2.5671 16.7917 2.58397 16.7917H15.4219L15.4267 16.7916C15.8382 16.7888 16.2426 16.6855 16.6049 16.4908C16.9671 16.2961 17.2761 16.0159 17.5049 15.6747C17.7337 15.3335 17.8754 14.9416 17.9175 14.5332C17.9597 14.1248 17.901 13.7124 17.7467 13.3318C17.7346 13.3019 17.7204 13.2729 17.7042 13.245L11.1967 2.04162C10.9787 1.6512 10.6604 1.32571 10.2745 1.09868C9.88646 0.870399 9.44423 0.75 8.99377 0.75ZM9.69096 6.03866C9.69096 5.65965 9.38305 5.35241 9.00321 5.35241C8.62338 5.35241 8.31547 5.65965 8.31547 6.03866V9.70201C8.31547 10.081 8.62338 10.3883 9.00321 10.3883C9.38305 10.3883 9.69096 10.081 9.69096 9.70201V6.03866ZM9.69096 12.4454C9.69096 12.0664 9.38305 11.7591 9.00321 11.7591C8.62338 11.7591 8.31547 12.0664 8.31547 12.4454V12.4545C8.31547 12.8335 8.62338 13.1408 9.00321 13.1408C9.38305 13.1408 9.69096 12.8335 9.69096 12.4545V12.4454Z" fill="#bb5b1d"/>
					</svg>';
		} elseif ( $type === 'error' ) {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M5.975 0.0625C5.75728 0.0625 5.54511 0.099599 5.34057 0.190505C5.13902 0.280083 4.97945 0.406612 4.8472 0.538864L0.538864 4.8472C0.406612 4.97945 0.280083 5.13902 0.190505 5.34057C0.099599 5.54511 0.0625 5.75728 0.0625 5.975V12.025C0.0625 12.2427 0.099599 12.4549 0.190505 12.6594C0.280083 12.861 0.406612 13.0206 0.538864 13.1528L4.8472 17.4611C4.97945 17.5934 5.13902 17.7199 5.34057 17.8095C5.54511 17.9004 5.75728 17.9375 5.975 17.9375H12.025C12.2427 17.9375 12.4549 17.9004 12.6594 17.8095C12.861 17.7199 13.0205 17.5934 13.1528 17.4611L17.4611 13.1528C17.5934 13.0205 17.7199 12.861 17.8095 12.6594C17.9004 12.4549 17.9375 12.2427 17.9375 12.025V5.975C17.9375 5.75728 17.9004 5.54511 17.8095 5.34057C17.7199 5.13902 17.5934 4.97945 17.4611 4.8472L13.1528 0.538864C13.0206 0.406612 12.861 0.280083 12.6594 0.190505C12.4549 0.099599 12.2427 0.0625 12.025 0.0625H5.975ZM9.6875 5.33333C9.6875 4.95364 9.3797 4.64583 9 4.64583C8.62031 4.64583 8.3125 4.95364 8.3125 5.33333V9C8.3125 9.3797 8.62031 9.6875 9 9.6875C9.3797 9.6875 9.6875 9.3797 9.6875 9V5.33333ZM9 11.9792C8.62031 11.9792 8.3125 12.287 8.3125 12.6667C8.3125 13.0464 8.62031 13.3542 9 13.3542H9.00917C9.38886 13.3542 9.69667 13.0464 9.69667 12.6667C9.69667 12.287 9.38886 11.9792 9.00917 11.9792H9Z" fill="#dc2626"/>
					</svg>';
		}
		return '';
	}

	public function get_renewal_text(): array {
		if ( $this->days_diff <= 30 && $this->days_diff > 0 ) {
			return [
				'title' => esc_html__( 'Ally Subscription Ending Soon!', 'pojo-accessibility' ),
				'description' => esc_html__( 'Renew now to keep access to Ally Assistant and continue improving your website\'s accessibility with guided fixes and scans.', 'pojo-accessibility' ),
				'btn' => esc_html__( 'Enable Auto-Renew', 'pojo-accessibility' ),
				'link' => esc_url( SettingsModule::get_upgrade_link( 'acc-renew-30' ) ),
				'type' => 'warning',
			];
		}
		if ( $this->days_diff <= 0 && $this->days_diff > -7 ) {
			return [
				'title' => esc_html__( 'Your Ally subscription has expired', 'pojo-accessibility' ),
				'description' => esc_html__( 'Ally Assistant is no longer active. Renew now to resume accessibility scans and step by step fixes for your site.', 'pojo-accessibility' ),
				'btn' => esc_html__( 'Renew Now', 'pojo-accessibility' ),
				'link' => esc_url( SettingsModule::get_upgrade_link( 'acc-renew-expire' ) ),
				'type' => 'error',
			];
		}
		return [
			'title' => esc_html__( "It's not too late - renew Ally", 'pojo-accessibility' ),
			'description' => esc_html__( "Reactivate your subscription to restore Ally Assistant and continue improving your website's accessibility.", 'pojo-accessibility' ),
			'btn' => esc_html__( 'Reactivate Now', 'pojo-accessibility' ),
			'link' => esc_url( SettingsModule::get_upgrade_link( 'acc-renew-post-expire' ) ),
			'type' => 'error',
		];
	}

	public function render_renewal_notice() {
		$text = $this->get_renewal_text();
		?>
		<div class="notice notice-info is-dismissible ea11y__notice ea11y__notice--<?php echo esc_attr( $text['type'] ); ?> ea11y__renewal-notice"
			 data-notice-slug="<?php echo esc_attr( self::RENEWAL_NOTICE_SLUG ); ?>" style="display:none;">
			<div class="ea11y__content-block">
				<div class="ea11y__notice-icon">
					<?php echo $this->get_notice_icon( $text['type'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
				<div class="ea11y__notice-content">
					<b>
						<?php echo $text['title']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</b>
					<span>
						<?php echo $text['description']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</span>
					<a class="ea11y__renewal-notice-btn" href="<?php echo esc_url( $text['link'] ); ?>" target="_blank" rel="noopener noreferrer">
						<?php echo $text['btn']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</a>
				</div>
			</div>
		</div>

		<script>
			jQuery( document ).ready( function( $ ) {
				setTimeout(function() {
					var msInOneDay = 24 * 60 * 60 * 1000;
					var timeDismissed = localStorage.getItem('<?php echo esc_js( self::RENEWAL_NOTICE_SLUG ); ?>');
					var showNotice = !timeDismissed || Date.now() - timeDismissed >= msInOneDay;

					var $notice = $( '[data-notice-slug="<?php echo esc_js( self::RENEWAL_NOTICE_SLUG ); ?>"]' );
					var $closeButton = $( '[data-notice-slug="<?php echo esc_js( self::RENEWAL_NOTICE_SLUG ); ?>"] .notice-dismiss' );

					if ( showNotice ) {
						$notice.css('display', 'flex');
						$closeButton.on( 'click', function () {
							localStorage.setItem('<?php echo esc_js( self::RENEWAL_NOTICE_SLUG ); ?>', Date.now().toString());
						} );
					} else {
						$notice.remove();
					}
				}, 0);
			} );
		</script>
		<?php
	}

	public function __construct() {
		add_action( 'current_screen', function () {
			if ( ! Connect::is_connected() || ! Utils::user_is_admin() ) {
				return;
			}

			$info = Settings::get( Settings::PLAN_DATA );

			if ( empty( $info ) || is_wp_error( $info ) ) {
				SettingsModule::refresh_plan_data();
				$info = Settings::get( Settings::PLAN_DATA );
			}

			if ( empty( $info ) || ! isset( $info->plan->next_cycle_date ) ) {
				return;
			}

			if ( isset( $info->plan->features->retention ) && $info->plan->features->retention !== 'None' ) {
				return;
			}

			if ( $this->date_diff_from_current( $info->plan->next_cycle_date ) > 30 ) {
				return;
			}

			if ( Utils::is_wp_dashboard_page() || Utils::is_wp_settings_page() || Utils::is_plugin_page() ) {
				add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_styles' ] );
				add_action( 'admin_notices', [ $this, 'render_renewal_notice' ] );
			}
		} );
	}

	public function enqueue_styles() {
		wp_enqueue_style(
			'ea11y-renewal-notice',
			EA11Y_ASSETS_URL . 'css/notice.css',
			[],
			EA11Y_VERSION
		);
	}
}
