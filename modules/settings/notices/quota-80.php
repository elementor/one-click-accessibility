<?php

namespace EA11y\Modules\Settings\Notices;

use EA11y\Classes\Utils\Notice_Base;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Settings\Module as SettingsModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Sticky_Deprecated_Nag
 */
class Quota_80 extends Notice_Base {
	public string $type = 'warning';
	public bool $is_dismissible = true;
	public bool $per_user = false;
	public $capability = 'manage_options';
	public string $id = 'quota-banner-80';

	public function content(): string {
		return sprintf( '<h3>%s</h3><p>%s</p><p><a class="button button-primary ea11y-dismiss-button" href="%s">%s</a></p>',
			__( 'You\'ve reached 80% of your widget monthly visits in Ally!', 'pojo-accessibility' ),
			__( 'Upgrade now to increase your plan\'s monthly widget visits limit and ensure all accessibility features remain available for every visitor.', 'pojo-accessibility' ),
			SettingsModule::get_upgrade_link( 'acc-80-quota' ),
			__( 'Upgrade Now', 'pojo-accessibility' ),
		);
	}

	public function maybe_add_quota_80_notice() : void {
		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! $plan_data ) {
			$this->conditions = false;
		}

		$plan_usage = (int) SettingsModule::get_plan_usage();

		if ( $plan_usage > 80 && $plan_usage < 100 ) {
			$this->conditions = true;
		} elseif ( $plan_usage < 80 ) {
			$this->undismiss();
			$this->conditions = false;
		} else {
			$this->conditions = false;
		}
	}

	public function print_js() {
		// used to make sure we only print this js once per page
		$action = 'admin_notices_print_js';
		if ( did_action( $action ) ) {
			return;
		}
		do_action( $action );

		?>
		<script>
			jQuery( document ).ready( function() {
				jQuery( '.ea11y-dismiss' ).on( 'click', function(e) {
					if ( ! e.target.classList.contains('notice-dismiss') && ! e.target.classList.contains('ea11y-dismiss-button') ) {
						return;
					}
					const $this = jQuery( this );
					const data = {
						action: 'ea11y_admin_notice_dismiss',
						nonce: $this.data( 'notice-nonce' ),
						notice_id: $this.data( 'notice-id' ),
					};
					jQuery.post( ajaxurl, data, function( response ) {
						if ( response.success ) {
							$this.slideUp();
						}
					} );
				} );
			} );
		</script>
		<?php
	}

	public function __construct() {
		add_action( 'current_screen', [ $this, 'maybe_add_quota_80_notice' ] );
		parent::__construct();
	}
}
