<?php

namespace EA11y\Modules\Widget\Components;

use Elementor\Core\DynamicTags\Data_Tag;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Ally_Trigger extends Data_Tag {

	public function get_name() {
		return 'ally-widget-trigger';
	}

	public function get_title() {
		return esc_html__( 'Ally Widget Trigger', 'pojo-accessibility' );
	}

	public function get_group() {
		return 'site';
	}

	public function get_categories() {
		return [ 'url' ];
	}

	public function get_value( array $options = [] ) {
		return \Elementor\Plugin::instance()->frontend->create_action_hash( 'allyWidget:open', [] );
	}
}
