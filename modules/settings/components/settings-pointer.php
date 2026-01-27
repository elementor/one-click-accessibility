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

		if ( SettingsModule::is_elementor_one() ) {
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
				$( '#toplevel_page_elementor-home' ).pointer( {
					content: '<?php echo wp_kses( $pointer_content, $allowed_tags ); ?>',
					pointerClass: 'ea11y-settings-pointer',
					position: {
						edge: 'top',
						align: 'left',
						at: 'left+20 bottom',
						my: 'left top'
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
				background: transparent;
                border-radius: 0;
				background-repeat: no-repeat;	
				content: '';
                background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2231%22%20height%3D%2232%22%20viewBox%3D%220%200%2031%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20y%3D%222.625%22%20width%3D%2229.375%22%20height%3D%2229.375%22%20rx%3D%225%22%20fill%3D%22%23FAE4FA%22%2F%3E%3Cpath%20d%3D%22M15.2873%2013.5675C15.2873%2013.1326%2014.9349%2012.7803%2014.5%2012.7803C14.0651%2012.7803%2013.7127%2013.1326%2013.7127%2013.5675C13.7127%2014.0025%2014.0651%2014.3548%2014.5%2014.3548C14.9349%2014.3548%2015.2873%2014.0025%2015.2873%2013.5675ZM16.0461%2013.5675C16.0461%2014.4213%2015.3537%2015.1136%2014.5%2015.1136C13.6463%2015.1136%2012.9539%2014.4213%2012.9539%2013.5675C12.9539%2012.7138%2013.6463%2012.0215%2014.5%2012.0215C15.3537%2012.0215%2016.0461%2012.7138%2016.0461%2013.5675Z%22%20fill%3D%22%23ED01EE%22%2F%3E%3Cpath%20d%3D%22M15.8706%2018.7941C15.8708%2018.2862%2016.2642%2017.8718%2016.7621%2017.8297C18.0738%2017.7188%2019.2004%2017.5441%2019.8001%2017.4406C19.8864%2017.4256%2019.9539%2017.3497%2019.9539%2017.2504V16.6653C19.9539%2016.539%2019.8404%2016.4391%2019.7113%2016.458C18.6416%2016.615%2016.4886%2016.9023%2014.8259%2016.9376L14.5%2016.941C12.8034%2016.941%2010.4298%2016.6254%209.28874%2016.458C9.15955%2016.4391%209.04614%2016.5391%209.04607%2016.6653V17.2504C9.04608%2017.3494%209.11374%2017.4256%209.20044%2017.4406C9.80019%2017.5441%2010.9265%2017.7188%2012.2379%2017.8297C12.7358%2017.8718%2013.1293%2018.2862%2013.1294%2018.7941V19.8332C13.1294%2020.0631%2013.0467%2020.2853%2012.897%2020.4598L10.501%2023.2529C10.4276%2023.3385%2010.4374%2023.4673%2010.5226%2023.5406H10.5232L10.9658%2023.9205C11.0513%2023.9937%2011.1801%2023.9842%2011.2535%2023.8989L13.7207%2021.0232C14.1048%2020.5755%2014.7972%2020.5756%2015.1813%2021.0232L17.6485%2023.8983C17.722%2023.9838%2017.8513%2023.9937%2017.9368%2023.9205L18.3794%2023.5406C18.4648%2023.4672%2018.475%2023.3385%2018.4016%2023.2529L16.0142%2020.4701C15.8968%2020.3332%2015.8706%2020.1734%2015.8706%2020.0616V18.7941ZM20.7127%2017.2504C20.7127%2017.7069%2020.3903%2018.1082%2019.9289%2018.188C19.3151%2018.2939%2018.1658%2018.4723%2016.8259%2018.5857C16.7124%2018.5953%2016.6295%2018.6884%2016.6294%2018.7941V20.0229L18.977%2022.759C19.3229%2023.1622%2019.277%2023.7697%2018.8739%2024.1159L18.4312%2024.4959H18.4307C18.0525%2024.8204%2017.495%2024.8%2017.1415%2024.464L17.0737%2024.3928L14.606%2021.5166C14.5245%2021.4218%2014.3775%2021.4218%2014.2961%2021.5166L11.8289%2024.3928C11.4827%2024.7959%2010.8752%2024.8419%2010.4719%2024.4959H10.4714L10.0287%2024.1159V24.1154C9.62572%2023.769%209.57977%2023.1621%209.92562%2022.759L12.3216%2019.9659C12.3533%2019.929%2012.3706%2019.8819%2012.3706%2019.8332V18.7941C12.3705%2018.6884%2012.2876%2018.5953%2012.1741%2018.5857C10.8345%2018.4723%209.68554%2018.2939%209.0717%2018.188C8.6105%2018.1085%208.28735%2017.7074%208.28728%2017.2504V16.6653C8.28735%2016.0721%208.81652%2015.6222%209.39926%2015.7077C10.5432%2015.8756%2012.8658%2016.1828%2014.5%2016.1828C16.1342%2016.1828%2018.4568%2015.8756%2019.6008%2015.7077C20.1835%2015.6222%2020.7127%2016.0721%2020.7127%2016.6653V17.2504Z%22%20fill%3D%22%23ED01EE%22%2F%3E%3Crect%20x%3D%2218.125%22%20width%3D%2212.5%22%20height%3D%2212.5%22%20rx%3D%226.25%22%20fill%3D%22%23ED01EE%22%2F%3E%3Ccircle%20cx%3D%2224.375%22%20cy%3D%226.25%22%20r%3D%225.625%22%20fill%3D%22white%22%2F%3E%3Cpath%20d%3D%22M24.375%200.625C21.2689%200.625%2018.75%203.14387%2018.75%206.25C18.75%209.35612%2021.2689%2011.875%2024.375%2011.875C27.4811%2011.875%2030%209.35612%2030%206.25C30%203.14387%2027.4811%200.625%2024.375%200.625ZM22.6875%209.0625H21.5625V3.4375H22.6875V9.0625ZM27.1875%209.0625H23.8125V7.9375H27.1875V9.0625ZM27.1875%206.8125H23.8125V5.6875H27.1875V6.8125ZM27.1875%204.5625H23.8125V3.4375H27.1875V4.5625Z%22%20fill%3D%22%23ED01EE%22%2F%3E%3C%2Fsvg%3E");
			}
		</style>
		<?php
	}

	public function __construct() {
		add_action( 'in_admin_header', [ $this, 'admin_print_script' ] );
	}
}
