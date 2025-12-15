<?php

namespace EA11y\Modules\Settings\Banners;

use EA11y\Modules\Core\Components\Pointers;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class BF_Sale_2025_Banner {
	const BANNER_POINTER_NAME = 'ea11y_bf_sale_2025_banner';
	const POINTER_ACTION = 'ea11y_pointer_dismissed';
	const POINTER_NONCE_KEY = 'ea11y-pointer-dismissed';

	public static function is_sale_time(): bool {
		$sale_start_time = strtotime( '2025-11-25 13:00:00 UTC' );
		$sale_end_time = strtotime( '2025-12-04 04:59:00 UTC' );

		$now_time = current_time( 'timestamp', true );
		
		return $now_time >= $sale_start_time && $now_time <= $sale_end_time;
	}

	public static function user_viewed_banner(): bool {
		return Pointers::is_dismissed( self::BANNER_POINTER_NAME );
	}

	/**
	 * Get banner markup
	 * @throws Throwable
	 */
	public static function get_banner( string $link ) {
		if ( ! self::is_sale_time() || self::user_viewed_banner() ) {
			return;
		}

		$img = plugins_url( '/images/bf-2025-banner.png', __FILE__ );
		$url = admin_url( 'admin-ajax.php' );
		$nonce = wp_create_nonce( self::POINTER_NONCE_KEY );
		?>

		<div class="elementor-ea11y-banner">
			<div class="elementor-ea11y-banner-container">
				<img src="<?php echo esc_url( $img ); ?>" alt="Elementor black friday sale banner" width="100%" />

				<a href="<?php echo esc_url( $link ); ?>" target="_blank">
					Get discount
				</a>

				<button>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd"
							clip-rule="evenodd"
							d="M13.2803 1.28033C13.5732 0.987437 13.5732 0.512563 13.2803 0.21967C12.9874 -0.0732233 12.5126 -0.0732233 12.2197 0.21967L6.75 5.68934L1.28033 0.21967C0.987437 -0.0732233 0.512563 -0.0732233 0.21967 0.21967C-0.0732233 0.512563 -0.0732233 0.987437 0.21967 1.28033L5.68934 6.75L0.21967 12.2197C-0.0732233 12.5126 -0.0732233 12.9874 0.21967 13.2803C0.512563 13.5732 0.987437 13.5732 1.28033 13.2803L6.75 7.81066L12.2197 13.2803C12.5126 13.5732 12.9874 13.5732 13.2803 13.2803C13.5732 12.9874 13.5732 12.5126 13.2803 12.2197L7.81066 6.75L13.2803 1.28033Z"
							fill="white"
						/>
					</svg>
				</button>
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
				background: #FF7BE5;
			}

			.elementor-ea11y-banner-container {
				position: relative;
				max-width: 1600px;
				margin: 0 auto;
				display: flex;
				justify-content: end;
				align-items: center;
				direction: ltr;
				height: 80px;
			}

			.elementor-ea11y-banner img {
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 100%;
			}

			.elementor-ea11y-banner a {
				position: relative;
				display: inline-block;
				padding: 12px 24px;
				font-size: 18px;
				color: #000;
				background-color: #FF7BE5;
				text-decoration: none;
				z-index: 2;
				font-weight: 500;
				line-height: 24px;
				letter-spacing: -0.36px;
				font-feature-settings: 'liga' off, 'clig' off;
			}

			.elementor-ea11y-banner button {
				position: relative;
				border: none;
				background: none;
				padding: 12px;
				margin: 0 24px;
				cursor: pointer;
				z-index: 2;
			}

			@media (max-width: 1170px) {
				.elementor-ea11y-banner a {
					padding: 6px 12px;
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
