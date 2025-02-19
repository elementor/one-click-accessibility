<?php

namespace EA11y\Modules\Legacy\Notices;

use EA11y\Classes\Utils\Notice_Base;
use EA11y\Modules\Legacy\Components\Upgrade;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Sticky_Deprecated_Nag
 */
class Sticky_Deprecated_Nag extends Notice_Base {
	public string $type = 'info';
	public bool $is_dismissible = false;
	public bool $per_user = true;
	public $capability = 'manage_options';
	public string $id = 'sticky-deprecated-nag';

	public function content(): string {
		return sprintf( '<h4>%s</h4><p>%s<a href="%s">%s</a></p><p><a class="button button-primary" href="%s">%s</a></p>',
            __( 'New accessibility plugin available!', 'pojo-accessibility' ),
			__( 'Your current plugin is no longer supported. Switch to Ally - Web Accessibility now to access more customization, control, and tools for a more inclusive site.', 'pojo-accessibility' ),
			Upgrade::get_learn_more_link( 'acc-notice-switch-oc' ), // link to learn more
			__( 'Learn More', 'pojo-accessibility' ),
			Upgrade::get_switch_now_link(), // link to switch now
			__( 'Switch to Ally', 'pojo-accessibility' )
		);
	}

	public function maybe_add_nag_deprecation_notice() {
		if (  ! Upgrade::is_legacy_page() ) {
			$this->conditions = false;
		}
	}

	public function __construct() {
		add_action( 'current_screen', [ $this, 'maybe_add_nag_deprecation_notice' ] );
		parent::__construct();
	}
}
