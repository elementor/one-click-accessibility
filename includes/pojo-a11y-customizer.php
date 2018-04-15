<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Pojo_A11y_Customizer {

	private $css_rules = array();
	private $css_code = '';

	public function get_customizer_fields() {
		$fields = array();

		$fields[] = array(
			'id' => 'a11y_toolbar_position',
			'title' => __( 'Position Toolbar', 'pojo-accessibility' ),
			'type' => 'select',
			'choices' => array(
				'left' => __( 'Left', 'pojo-accessibility' ),
				'right' => __( 'Right', 'pojo-accessibility' ),
			),
			'std' => is_rtl() ? 'right' : 'left',
		);

		$fields[] = array(
			'id' => 'a11y_toolbar_distance_top',
			'title' => __( 'Distance from Top (Desktop)', 'pojo-accessibility' ),
			'type' => 'text',
			'std' => '100px',
		);

		$fields[] = array(
			'id' => 'a11y_toolbar_distance_top_mobile',
			'title' => __( 'Distance from Top (Mobile)', 'pojo-accessibility' ),
			'type' => 'text',
			'std' => '50px',
		);

		$fields[] = array(
			'id' => 'a11y_bg_toolbar',
			'title' => __( 'Background Toolbar', 'pojo-accessibility' ),
			'type' => 'color',
			'std' => '#ffffff',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay',
			'change_type' => 'bg_color',
		);

		$fields[] = array(
			'id' => 'a11y_color_toolbar',
			'title' => __( 'Color Toolbar', 'pojo-accessibility' ),
			'type' => 'color',
			'std' => '#333333',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a, #pojo-a11y-toolbar .pojo-a11y-toolbar-overlay p.pojo-a11y-toolbar-title',
			'change_type' => 'color',
		);

		$fields[] = array(
			'id' => 'a11y_toggle_button_bg_color',
			'title' => __( 'Toggle Button Background', 'pojo-accessibility' ),
			'type' => 'color',
			'std' => '#4054b2',
		);

		$fields[] = array(
			'id' => 'a11y_toggle_button_color',
			'title' => __( 'Toggle Button Color', 'pojo-accessibility' ),
			'type' => 'color',
			'std' => '#ffffff',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-toggle a',
			'change_type' => 'color',
		);

		$fields[] = array(
			'id' => 'a11y_bg_active',
			'title' => __( 'Background Active', 'pojo-accessibility' ),
			'type' => 'color',
			'std' => '#4054b2',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a.active',
			'change_type' => 'bg_color',
		);

		$fields[] = array(
			'id' => 'a11y_color_active',
			'title' => __( 'Color Active', 'pojo-accessibility' ),
			'type' => 'color',
			'std' => '#ffffff',
			'selector' => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a.active',
			'change_type' => 'color',
		);

		$fields[] = array(
			'id' => 'a11y_focus_outline_style',
			'title' => __( 'Focus Outline Style', 'pojo-accessibility' ),
			'type' => 'select',
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
			'type' => 'select',
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
			'type' => 'color',
			'std' => '#FF0000',
		);

		return $fields;
	}

	public function customize_a11y( $wp_customize ) {
		$fields = $this->get_customizer_fields();

		$wp_customize->add_section( 'accessibility', array(
			'title' => __( 'Accessibility', 'pojo-accessibility' ),
			'priority'   => 30,
		) );

		foreach ( $fields as $field ) {
			$customizer_id = POJO_A11Y_CUSTOMIZER_OPTIONS . '[' . $field['id'] . ']';
			$wp_customize->add_setting( $customizer_id, array(
				'default' => $field['std'] ? $field['std'] : null,
				'type' => 'option',
			) );
			switch ( $field['type'] ) {
				case 'color':
					$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $field['id'], array(
						'label'    => $field['title'],
						'section'  => 'accessibility',
						'settings' => $customizer_id,
					) ) );
					break;
				case 'select':
				case 'text':
					$wp_customize->add_control( $field['id'], array(
						'label'    => $field['title'],
						'section'  => 'accessibility',
						'settings' => $customizer_id,
						'type'     => $field['type'],
						'choices'  => isset( $field['choices'] ) ? $field['choices'] : null,
					) );
					break;
			}
		}
	}

	public function get_custom_css_code() {
		$options = $this->get_customizer_options();
		$bg_color = $options['a11y_toggle_button_bg_color']; // get_theme_mod( 'a11y_toggle_button_bg_color', '#4054b2' );
		if ( ! empty( $bg_color ) ) {
			$this->add_css_rule( '#pojo-a11y-toolbar .pojo-a11y-toolbar-toggle a', 'background-color', $bg_color );
			$this->add_css_rule( '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay, #pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items.pojo-a11y-links', 'border-color', $bg_color );
		}

		$outline_style = $options['a11y_focus_outline_style']; //get_theme_mod( 'a11y_focus_outline_style', 'solid' );
		if ( ! empty( $outline_style ) ) {
			$this->add_css_rule( 'body.pojo-a11y-focusable a:focus', 'outline-style', $outline_style . ' !important' );
		}

		$outline_width = $options['a11y_focus_outline_width']; // get_theme_mod( 'a11y_focus_outline_width', '1px' );
		if ( ! empty( $outline_width ) ) {
			$this->add_css_rule( 'body.pojo-a11y-focusable a:focus', 'outline-width', $outline_width . ' !important' );
		}

		$outline_color = $options['a11y_focus_outline_color']; //get_theme_mod( 'a11y_focus_outline_color', '#FF0000' );
		if ( ! empty( $outline_color ) ) {
			$this->add_css_rule( 'body.pojo-a11y-focusable a:focus', 'outline-color', $outline_color . ' !important' );
		}

		$distance_top = $options['a11y_toolbar_distance_top']; //get_theme_mod( 'a11y_toolbar_distance_top', '100px' );
		if ( ! empty( $distance_top ) ) {
			$this->add_css_rule( '#pojo-a11y-toolbar', 'top', $distance_top . ' !important' );
		}

		$distance_top_mobile = $options['a11y_toolbar_distance_top_mobile']; // get_theme_mod( 'a11y_toolbar_distance_top_mobile', '50px' );
		if ( ! empty( $distance_top_mobile ) ) {
			$this->add_css_code( "@media (max-width: 767px) { #pojo-a11y-toolbar { top: {$distance_top_mobile} !important; } }" );
		}

		$fields = $this->get_customizer_fields();
		foreach ( $fields as $field ) {
			if ( empty( $field['selector'] ) || empty( $field['change_type'] ) ) {
				continue;
			}

//			$option = get_theme_mod( $field['id'], $field['std'] );
//			if ( empty( $option ) ) {
//				continue;
//			}

			$option = $options[ $field['id'] ];

			if ( 'color' === $field['change_type'] ) {
				$this->add_css_rule( $field['selector'], 'color', $option );
			} elseif ( 'bg_color' === $field['change_type'] ) {
				$this->add_css_rule( $field['selector'], 'background-color', $option );
			}
		}
	}

	private function get_customizer_options() {
		static $options = false;
		if ( false === $options ) {
			$options = get_option( POJO_A11Y_CUSTOMIZER_OPTIONS );
		}
		return $options;
	}

	private function add_css_rule( $selector, $rule, $value ) {
		if ( ! isset( $this->css_rules[ $selector ] ) ) {
			$this->css_rules[ $selector ] = array();
		}
		$this->css_rules[ $selector ][] = $rule . ': ' . $value . ';';
	}

	private function add_css_code( $code ) {
		$this->css_code .= "\n" . $code;
	}

	public function print_css_code() {
		$this->get_custom_css_code();

		foreach ( $this->css_rules as $selector => $css_rules ) {
			$this->css_code .= "\n" . $selector . '{ ' . implode( "\t", $css_rules ) . '}';
		}
		echo '<!--- pojo accessibility custom  css --->' . "\n";
		echo '<style type="text/css">' . $this->css_code . '</style>';
	}

	public function __construct() {
		add_filter( 'customize_register', array( &$this, 'customize_a11y' ), 610 );
		add_filter( 'wp_head', array( &$this, 'print_css_code' ) );
	}
}