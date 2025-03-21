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
		return sprintf( '<h3>%s</h3><p>%s</p><p><a class="button button-primary" href="%s">%s</a></p>',
			__( 'You\'ve reached 80% of your monthly widget loads in Ally!', 'pojo-accessibility' ),
			__( 'Upgrade now to increase your plan’s monthly widget loads limit and ensure all accessibility features remain fully available for every visitor.', 'pojo-accessibility' ),
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

	public function __construct() {
		add_action( 'current_screen', [ $this, 'maybe_add_quota_80_notice' ] );
		parent::__construct();
	}
}
