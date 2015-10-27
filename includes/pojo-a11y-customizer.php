<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Pojo_A11y_Customizer {

	public function customize_a11y( $sections = array() ) {
		$fields = array();

		$fields[] = array(
			'id' => 'a11y_bg_toolbar',
			'title' => __( 'Background Toolbar', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#ffffff',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay',
			'change_type' => 'bg_color',
		);

		$fields[] = array(
			'id' => 'a11y_color_toolbar',
			'title' => __( 'Color Toolbar', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#333333',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a, #pojo-a11y-toolbar .pojo-a11y-toolbar-overlay p.pojo-a11y-toolbar-title',
			'change_type' => 'color',
		);

		$fields[] = array(
			'id' => 'a11y_toggle_button_bg_color',
			'title' => __( 'Toggle Button Background', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#4054b2',
		);
		
		$fields[] = array(
			'id' => 'a11y_toggle_button_color',
			'title' => __( 'Toggle Button Color', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#ffffff',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-toggle a',
			'change_type' => 'color',
		);
		
		$fields[] = array(
			'id' => 'a11y_bg_active',
			'title' => __( 'Background Active', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#4054b2',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a.active',
			'change_type' => 'bg_color',
		);
		
		$fields[] = array(
			'id' => 'a11y_color_active',
			'title' => __( 'Color Active', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#ffffff',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a.active',
			'change_type' => 'color',
		);

		$sections[] = array(
			'id' => 'accessibility',
			'title' => __( 'Accessibility', 'pojo-accessibility' ),
			'desc' => '',
			'fields' => $fields,
		);

		return $sections;
	}

	public function custom_css_code( Pojo_Create_CSS_Code $css_code ) {
		$bg_color = get_theme_mod( 'a11y_toggle_button_bg_color', '#4054b2' );
		if ( ! empty( $bg_color ) ) {
			$css_code->add_value( '#pojo-a11y-toolbar .pojo-a11y-toolbar-toggle a', 'background-color', $bg_color );
			$css_code->add_value( '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay, #pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items.pojo-a11y-links', 'border-color', $bg_color );
		}
	}
	
	public function __construct() {
		add_filter( 'pojo_register_customize_sections', array( &$this, 'customize_a11y' ), 610 );
		add_filter( 'pojo_wp_head_custom_css_code', array( &$this, 'custom_css_code' ) );
	}
	
}