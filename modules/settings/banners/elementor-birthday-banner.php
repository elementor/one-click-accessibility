<?php

namespace EA11y\Modules\Settings\Banners;

use EA11y\Modules\Core\Components\Pointers;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Elementor_Birthday_Banner {
	const BANNER_POINTER_NAME = 'ea11y_birthday_sale_banner';
	const POINTER_ACTION = 'ea11y_pointer_dismissed';
	const POINTER_NONCE_KEY = 'ea11y-pointer-dismissed';

	public static function is_sale_time(): bool {
		$sale_start_time = gmmktime( 9, 30, 0, 6, 15, 2026 );
		$sale_end_time = gmmktime( 6, 59, 59, 6, 18, 2026 );

		$now_time = gmdate( 'U' );

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
		if ( ! self::is_sale_time() ) {
			return;
		}

		if ( self::user_viewed_banner() ) {
			return;
		}

		$img = plugins_url( '/images/elementor-birthday-banner.jpg', __FILE__ );
		$url = admin_url( 'admin-ajax.php' );
		$nonce = wp_create_nonce( self::POINTER_NONCE_KEY );
		?>
		<div class="elementor-birthday-banner" role="region" aria-label="<?php esc_attr_e( 'Elementor birthday sale', 'pojo-accessibility' ); ?>">
			<div class="elementor-birthday-banner-container">
				<p><span><?php esc_html_e( 'Celebrate Elementor’s 10th birthday', 'pojo-accessibility' ); ?></span> | <?php esc_html_e( 'Up to 30% off', 'pojo-accessibility' ); ?></p>
				<a href="<?php echo esc_url( $link ); ?>" target="_blank"><?php esc_html_e( 'Get discounts', 'pojo-accessibility' ); ?></a>
			</div>
			<button type="button" aria-label="<?php esc_attr_e( 'Dismiss', 'pojo-accessibility' ); ?>">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path clip-rule="evenodd" fill-rule="evenodd" fill="#212121" d="M13.2803 1.28033C13.5732 0.987437 13.5732 0.512563 13.2803 0.21967C12.9874 -0.0732233 12.5126 -0.0732233 12.2197 0.21967L6.75 5.68934L1.28033 0.21967C0.987437 -0.0732233 0.512563 -0.0732233 0.21967 0.21967C-0.0732233 0.512563 -0.0732233 0.987437 0.21967 1.28033L5.68934 6.75L0.21967 12.2197C-0.0732233 12.5126 -0.0732233 12.9874 0.21967 13.2803C0.512563 13.5732 0.987437 13.5732 1.28033 13.2803L6.75 7.81066L12.2197 13.2803C12.5126 13.5732 12.9874 13.5732 13.2803 13.2803C13.5732 12.9874 13.5732 12.5126 13.2803 12.2197L7.81066 6.75L13.2803 1.28033Z"/>
				</svg>
			</button>
		</div>

		<style>
			.elementor-birthday-banner {
				min-height: 48px;
				display: flex;
				margin-inline-start: -20px;
				z-index: 2;
				background-image: url('<?php echo esc_url( $img ); ?>');
				background-size: cover;
				background-position: center;
				background-repeat: no-repeat;
			}

			.elementor-birthday-banner-container {
				max-width: 1200px;
				margin: 0 auto;
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 20px;
			}

			.elementor-birthday-banner p {
				margin: 0;
				color: #2A0624;
				font-size: 16px;
				font-style: normal;
				font-weight: 400;
				font-feature-settings: 'liga' off, 'clig' off;
				line-height: 1.4;
			}

			.elementor-birthday-banner p span {
				font-weight: 700;
			}

			.elementor-birthday-banner a {
				padding: 4px 16px;
				border-radius: 6px;
				background-color: #212121;
				color: #fff;
				font-size: 14px;
				font-weight: 500;
				font-feature-settings: 'liga' off, 'clig' off;
				line-height: 1.4;
				text-decoration: none;
				text-align: center;
			}

			.elementor-birthday-banner button {
				background: none;
				border: none;
				padding: 12px;
				margin: 0 24px;
				cursor: pointer;
				float: inline-end;
				line-height: 0;
			}
		</style>

		<script>
			document.addEventListener('DOMContentLoaded', function () {
				const banner = document.querySelector('.elementor-birthday-banner');
				const button = document.querySelector('.elementor-birthday-banner button');

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
								success: () => banner.remove(),
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
