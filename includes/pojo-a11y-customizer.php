<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Pojo_A11y_Customizer {

	public function customize_a11y( $sections = array() ) {
		$fields = array();

		$fields[] = array(
			'id' => 'a11y_toolbar_position',
			'title' => __( 'Position Toolbar', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_SELECT,
			'choices' => array(
				'left' => __( 'Left', 'pojo-accessibility' ),
				'right' => __( 'Right', 'pojo-accessibility' ),
			),
			'std' => is_rtl() ? 'right' : 'left',
		);

		$fields[] = array(
			'id' => 'a11y_toolbar_distance_top',
			'title' => __( 'Distance from Top (Desktop)', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_TEXT,
			'std' => '100px',
		);

		$fields[] = array(
			'id' => 'a11y_toolbar_distance_top_mobile',
			'title' => __( 'Distance from Top (Mobile)', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_TEXT,
			'std' => '50px',
		);

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

		$fields[] = array(
			'id' => 'a11y_focus_outline_style',
			'title' => __( 'Focus Outline Style', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_SELECT,
			'choices' => array(
				'solid' => __( 'Solid', 'pojo-accessibility' ),
				'dotted' => __( 'Dotted', 'pojo-accessibility' ),
				'dashed' => __( 'Dashed', 'pojo-accessibility' ),
				'double' => __( 'Double', 'pojo-accessibility' ),
				'groove' => __( 'Groove', 'pojo-accessibility' ),
				'ridge' => __( 'Ridge', 'pojo-accessibility' ),
				'outset' => __( 'Outset', 'pojo-accessibility' ),
				'initial' => __( 'Initial', 'pojo-accessibility' ),
			),
			'std' => 'solid',
		);

		$fields[] = array(
			'id' => 'a11y_focus_outline_width',
			'title' => __( 'Focus Outline Width', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_SELECT,
			'choices' => array(
				'1px' => '1px',
				'2px' => '2px',
				'3px' => '3px',
				'4px' => '4px',
				'5px' => '5px',
				'6px' => '6px',
				'7px' => '7px',
				'8px' => '8px',
				'9px' => '9px',
				'10px' => '10px',
			),
			'std' => '1px',
		);

		$fields[] = array(
			'id' => 'a11y_focus_outline_color',
			'title' => __( 'Focus Outline Color', 'pojo-accessibility' ),
			'type' => Pojo_Theme_Customize::FIELD_COLOR,
			'std' => '#FF0000',
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
		
		$outline_style = get_theme_mod( 'a11y_focus_outline_style', 'solid' );
		if ( ! empty( $outline_style ) ) {
			$css_code->add_value( 'body.pojo-a11y-focusable a:focus', 'outline-style', $outline_style . ' !important' );
		}
		
		$outline_width = get_theme_mod( 'a11y_focus_outline_width', '1px' );
		if ( ! empty( $outline_width ) ) {
			$css_code->add_value( 'body.pojo-a11y-focusable a:focus', 'outline-width', $outline_width . ' !important' );
		}
		
		$outline_color = get_theme_mod( 'a11y_focus_outline_color', '#FF0000' );
		if ( ! empty( $outline_color ) ) {
			$css_code->add_value( 'body.pojo-a11y-focusable a:focus', 'outline-color', $outline_color . ' !important' );
		}
		
		$distance_top = get_theme_mod( 'a11y_toolbar_distance_top', '100px' );
		if ( ! empty( $distance_top ) ) {
			$css_code->add_value( '#pojo-a11y-toolbar', 'top', $distance_top . ' !important' );
		}
		
		$distance_top_mobile = get_theme_mod( 'a11y_toolbar_distance_top_mobile', '50px' );
		if ( ! empty( $distance_top_mobile ) ) {
			$css_code->add_data( "@media (max-width: 767px) { #pojo-a11y-toolbar { top: {$distance_top_mobile} !important } }" );
		}
	}
	
	public function __construct() {
		add_filter( 'pojo_register_customize_sections', array( &$this, 'customize_a11y' ), 610 );
		add_filter( 'pojo_wp_head_custom_css_code', array( &$this, 'custom_css_code' ) );
	}
	
}