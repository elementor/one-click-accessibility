<?php

namespace EA11y\Modules\Legacy\Notices;

use EA11y\Classes\Utils\Notice_Base;
use EA11y\Modules\Legacy\Components\Upgrade;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Dismissible_Deprecated_Nag
 */
class Dismissible_Deprecated_Nag extends Notice_Base {
	public string $type = 'info';
	public bool $is_dismissible = true;
	public bool $per_user = true;
	public $capability = 'manage_options';
	public string $id = 'dismissible-deprecated-nag';

	public string $content = '<p>Time to take your site’s accessibility to the next level with {{appName}}, our newest plugin packed with advanced widget customization, flexible feature controls, and a built-in statement generator. Want more details before switching? Learn more</p>';

	public function maybe_add_nag_deprecation_notice() {
		if (  Upgrade::is_legacy_page() ) {
			$this->conditions = false;
		}
	}

	public function content(): string {
		return $this->content . '<p><a class="button button-primary" href="' . esc_attr( Upgrade::get_switch_now_link() ). '">Switch To {{appName}}</a></p>';
	}

	public function __construct() {
		add_action( 'current_screen', [ $this, 'maybe_add_nag_deprecation_notice' ] );
		parent::__construct();
	}
}
