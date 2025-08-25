<?php

namespace EA11y\Modules\Settings\Banners;

use EA11y\Modules\Core\Components\Pointers;
use EA11y\Modules\Scanner\Database\Scans_Table;
use EA11y\Modules\Connect\Module as Connect;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Onboarding_Banner {
	const BANNER_POINTER_NAME = 'ea11y_onboarding_banner';
	const POINTER_ACTION = 'ea11y_pointer_dismissed';
	const POINTER_NONCE_KEY = 'ea11y-pointer-dismissed';

	public static function user_viewed_banner(): bool {
		return Pointers::is_dismissed( self::BANNER_POINTER_NAME );
	}

	/**
	 * Check if user has performed any scans
	 * @return bool
	 */
	public static function user_has_scanned_pages(): bool {
		$scan_count = Scans_Table::select_var( 'COUNT(*)' );
		return intval( $scan_count ) > 0;
	}

	/**
	 * Get banner markup
	 * @throws Throwable
	 */
	public static function get_banner() {

		if ( ! Connect::is_connected() ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( self::user_viewed_banner() || self::user_has_scanned_pages() ) {
			return;
		}

		$url = admin_url( 'admin-ajax.php' );
		$nonce = wp_create_nonce( self::POINTER_NONCE_KEY );
		$link = admin_url( 'admin.php?page=accessibility-settings&source=admin_banner' );
		?>

		<div class="elementor-ea11y-banner elementor-ea11y-onboarding-banner notice notice-info info">
			<div class="elementor-ea11y-banner-container">
				<div class="elementor-ea11y-banner-content">
				<div class="elementor-ea11y-banner-content-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 43 43" fill="none">
						<path d="M21.3937 42.7875C33.2092 42.7875 42.7875 33.2092 42.7875 21.3937C42.7875 9.57831 33.2092 0 21.3937 0C9.57831 0 0 9.57831 0 21.3937C0 33.2092 9.57831 42.7875 21.3937 42.7875Z" fill="#2563EB"/>
						<path d="M21.3954 13.4431C23.1077 13.4431 24.4958 12.055 24.4958 10.3427C24.4958 8.63031 23.1077 7.24219 21.3954 7.24219C19.683 7.24219 18.2949 8.63031 18.2949 10.3427C18.2949 12.055 19.683 13.4431 21.3954 13.4431Z" fill="#ffffff"/>
						<path d="M33.0433 13.2168L25.9471 14.3056C22.8936 14.6233 19.7987 14.615 16.6623 14.3056L9.75116 13.2196C8.73425 13.1864 7.88867 14.0016 7.88867 15.0213C7.88867 16.0409 8.50213 16.6931 9.63786 16.823L14.8274 17.5083L21.9347 18.2626L17.4609 18.5887L16.8446 33.8976C16.8446 34.8095 17.5825 35.5473 18.4944 35.5473C19.3565 35.5473 20.075 34.8814 20.1385 34.022L20.6581 27.1413C20.6912 26.7074 21.0532 26.373 21.4871 26.373C21.9209 26.373 22.2829 26.7074 22.3161 27.1413L22.8356 34.022C22.9019 34.8814 23.6176 35.5473 24.4797 35.5473C25.3916 35.5473 26.1295 34.8095 26.1295 33.8976L25.5547 19.7742C25.5547 18.7407 26.3754 17.8924 27.4089 17.8592L33.1539 16.8257C34.2979 16.624 34.903 15.9995 34.903 15.024C34.903 14.0043 34.0602 13.1864 33.0433 13.2196V13.2168Z" fill="#ffffff"/>
					</svg>
				</div>
					<div class="elementor-ea11y-banner-content-text">
						<h2>
							<?php _e( 'New in Ally: Accessibility Assistant', 'pojo-accessibility' ); ?>
						</h2>
						<p>
							<?php _e( 'Scan your site for accessibility issues and start fixing them with ease. It\'s already part of your plan.', 'pojo-accessibility' ); ?>
						</p>
						<a class="elementor-ea11y-run-scan-button button button-primary" href="<?php echo esc_url( $link ); ?>" target="_blank">
							<?php _e( 'Try it now', 'pojo-accessibility' ); ?>
						</a>
					</div>
				</div>
				<div class="elementor-ea11y-banner-actions">
					<button class="elementor-ea11y-banner-close">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path 
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M13.2803 1.28033C13.5732 0.987437 13.5732 0.512563 13.2803 0.21967C12.9874 -0.0732233 12.5126 -0.0732233 12.2197 0.21967L6.75 5.68934L1.28033 0.21967C0.987437 -0.0732233 0.512563 -0.0732233 0.21967 0.21967C-0.0732233 0.512563 -0.0732233 0.987437 0.21967 1.28033L5.68934 6.75L0.21967 12.2197C-0.0732233 12.5126 -0.0732233 12.9874 0.21967 13.2803C0.512563 13.5732 0.987437 13.5732 1.28033 13.2803L6.75 7.81066L12.2197 13.2803C12.5126 13.5732 12.9874 13.5732 13.2803 13.2803C13.5732 12.9874 13.5732 12.5126 13.2803 12.2197L7.81066 6.75L13.2803 1.28033Z"
							fill="black"
							fill-opacity="0.56"
						/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<style>
			html[dir="rtl"] #ea11y-app,
			html:not([dir="rtl"]) #ea11y-app {
				height: calc(100vh - 32px - 80px);
			}

			.elementor-ea11y-banner {
				overflow: hidden;
				margin-inline-start: -20px;
				border-left-color: #2563EB;
				padding: 0;
			}

			.elementor-ea11y-banner-container {
				position: relative;
				width: 100%;
				display: flex;
				justify-content: space-between;
				direction: ltr;
				height: 130px;
				gap: 12px;
			}

			.elementor-ea11y-banner-content {
				display: flex;
				gap: 16px;
			}
			.elementor-ea11y-banner-content-icon {
				background: #EFF5FE;
				padding: 16px 12px;
			}

			.elementor-ea11y-banner-content-text {
				padding: 16px;
			}

			.elementor-ea11y-banner-content-text h2 {
				margin: 0 0 2px 0;
			}

			.elementor-ea11y-banner-content-text p {
				margin: 0 0 16px 0;
			}

			a.elementor-ea11y-run-scan-button {
				background-color: #2563EB !important;
				padding: 4px 10px !important;
			}

			a.elementor-ea11y-run-scan-button:hover {
				background-color: #1D4ED8 !important;
			}

			.elementor-ea11y-banner-actions {
				padding: 16px;
			}

			.elementor-ea11y-banner-actions button {
				position: relative;
				border: none;
				background: none;
				padding: 0;
				margin: 0;
				cursor: pointer;
				z-index: 2;
			}

			@media (max-width: 1170px) {
				.elementor-ea11y-banner a {
					padding: 6px 10px;
					font-size: 14px;
				}
			}

			@media (max-width: 845px) {
				.elementor-ea11y-banner button {
					margin: 0 6px;
				}
			}
		</style>

		<script>
			document.addEventListener('DOMContentLoaded', function () {
				const banner = document.querySelector('.elementor-ea11y-banner');
				const button = document.querySelector('.elementor-ea11y-banner button');
				const pageRoot = document.querySelector('#ea11y-app');

				const requestData = {
					action: "<?php echo esc_js( self::POINTER_ACTION ); ?>",
					nonce: "<?php echo esc_js( $nonce ); ?>",
					data: {
						pointer: "<?php echo esc_js( self::BANNER_POINTER_NAME ); ?>",
					}
				};

				if (button) {
					button.addEventListener('click', function () {
						jQuery.ajax(
							{
								url: '<?php echo esc_js( $url ); ?>',
								method: 'POST',
								data: requestData,
								success: () => {
									banner.remove();

									if (pageRoot) {
										pageRoot.style.height = 'calc(100vh - 32px)';
									}
								},
								error: (error) => console.error('Error:', error),
							}
						);
					});
				}
			});

		</script>
		<?php
	}
}
