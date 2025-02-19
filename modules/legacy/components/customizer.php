<?php

namespace EA11y\Modules\Legacy\Components;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Customizer
 */
class Customizer {

	private $css_rules = [];
	private $css_code = '';

	public function get_customizer_fields() {
		$fields = [];

		$fields[] = [
			'id'          => 'a11y_toolbar_icon',
			'title'       => __( 'Toolbar Icon', 'pojo-accessibility' ),
			'type'        => 'select',
			'choices'     => [
				'one-click'     => __( 'One Click', 'pojo-accessibility' ),
				'wheelchair'    => __( 'Wheelchair', 'pojo-accessibility' ),
				'accessibility' => __( 'Accessibility', 'pojo-accessibility' ),
			],
			'std'         => 'one-click',
			'description' => __( 'Set Toolbar Icon', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_toolbar_position',
			'title'       => __( 'Toolbar Position', 'pojo-accessibility' ),
			'type'        => 'select',
			'choices'     => [
				'left'  => __( 'Left', 'pojo-accessibility' ),
				'right' => __( 'Right', 'pojo-accessibility' ),
			],
			'std'         => is_rtl() ? 'right' : 'left',
			'description' => __( 'Set Toolbar Position', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_toolbar_distance_top',
			'title'       => __( 'Offset from Top (Desktop)', 'pojo-accessibility' ),
			'type'        => 'text',
			'std'         => '100px',
			'description' => __( 'Set Toolbar top offset (Desktop)', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_toolbar_distance_top_mobile',
			'title'       => __( 'Offset from Top (Mobile)', 'pojo-accessibility' ),
			'type'        => 'text',
			'std'         => '50px',
			'description' => __( 'Set Toolbar top offset (Mobile)', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_bg_toolbar',
			'title'       => __( 'Toolbar Background', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#ffffff',
			'selector'    => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay',
			'change_type' => 'bg_color',
			'description' => __( 'Set Toolbar background color', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_color_toolbar',
			'title'       => __( 'Toolbar Color', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#333333',
			'selector'    => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a, #pojo-a11y-toolbar .pojo-a11y-toolbar-overlay p.pojo-a11y-toolbar-title',
			'change_type' => 'color',
			'description' => __( 'Set Toolbar text color', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_toggle_button_bg_color',
			'title'       => __( 'Toggle Button Background', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#4054b2',
			'description' => __( 'Set Toolbar toggle button background color', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_toggle_button_color',
			'title'       => __( 'Toggle Button Color', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#ffffff',
			'selector'    => '#pojo-a11y-toolbar .pojo-a11y-toolbar-toggle a',
			'change_type' => 'color',
			'description' => __( 'Set Toolbar toggle button icon color', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_bg_active',
			'title'       => __( 'Active Background', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#4054b2',
			'selector'    => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a.active',
			'change_type' => 'bg_color',
			'description' => __( 'Set Toolbar active background color', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_color_active',
			'title'       => __( 'Active Color', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#ffffff',
			'selector'    => '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items li.pojo-a11y-toolbar-item a.active',
			'change_type' => 'color',
			'description' => __( 'Set Toolbar active text color', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_focus_outline_style',
			'title'       => __( 'Focus Outline Style', 'pojo-accessibility' ),
			'type'        => 'select',
			'choices'     => [
				'solid'   => __( 'Solid', 'pojo-accessibility' ),
				'dotted'  => __( 'Dotted', 'pojo-accessibility' ),
				'dashed'  => __( 'Dashed', 'pojo-accessibility' ),
				'double'  => __( 'Double', 'pojo-accessibility' ),
				'groove'  => __( 'Groove', 'pojo-accessibility' ),
				'ridge'   => __( 'Ridge', 'pojo-accessibility' ),
				'outset'  => __( 'Outset', 'pojo-accessibility' ),
				'initial' => __( 'Initial', 'pojo-accessibility' ),
			],
			'std'         => 'solid',
			'description' => __( 'Set Focus outline style', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_focus_outline_width',
			'title'       => __( 'Focus Outline Width', 'pojo-accessibility' ),
			'type'        => 'select',
			'choices'     => [
				'1px'  => '1px',
				'2px'  => '2px',
				'3px'  => '3px',
				'4px'  => '4px',
				'5px'  => '5px',
				'6px'  => '6px',
				'7px'  => '7px',
				'8px'  => '8px',
				'9px'  => '9px',
				'10px' => '10px',
			],
			'std'         => '1px',
			'description' => __( 'Set Focus outline width', 'pojo-accessibility' ),
		];

		$fields[] = [
			'id'          => 'a11y_focus_outline_color',
			'title'       => __( 'Focus Outline Color', 'pojo-accessibility' ),
			'type'        => 'color',
			'std'         => '#FF0000',
			'description' => __( 'Set Focus outline color', 'pojo-accessibility' ),
		];

		return $fields;
	}

	public function customize_a11y( $wp_customize ) {
		$fields = $this->get_customizer_fields();

		$section_description = '<p>' . __( 'Use the control below to customize the appearance and layout of the Accessibility Toolbar', 'pojo-accessibility' ) . '</p><p>' .
			sprintf( __( 'Additional Toolbar settings can be configured at the %s page.', 'pojo-accessibility' ),
			'<a href="' . admin_url( 'admin.php?page=accessibility-toolbar' ) . '" target="blank">' . __( 'Accessibility Toolbar', 'pojo-accessibility' ) . '</a>'
			) . '</p>' . apply_filters( 'pojo_a11y_customizer_section_description', '' );

		$wp_customize->add_section( 'accessibility', [
			'title'       => __( 'Accessibility', 'pojo-accessibility' ),
			'priority'    => 30,
			'description' => $section_description,
		] );

		foreach ( $fields as $field ) {
			$customizer_id = POJO_A11Y_CUSTOMIZER_OPTIONS . '[' . $field['id'] . ']';
			$wp_customize->add_setting( $customizer_id, [
				'default' => $field['std'] ? $field['std'] : null,
				'type'    => 'option',
			] );
			switch ( $field['type'] ) {
				case 'color':
					$wp_customize->add_control( new \WP_Customize_Color_Control( $wp_customize, $field['id'], [
						'label'       => $field['title'],
						'section'     => 'accessibility',
						'settings'    => $customizer_id,
						'description' => isset( $field['description'] ) ? $field['description'] : null,
					] ) );
					break;
				case 'select':
				case 'text':
					$wp_customize->add_control( $field['id'], [
						'label'       => $field['title'],
						'section'     => 'accessibility',
						'settings'    => $customizer_id,
						'type'        => $field['type'],
						'choices'     => isset( $field['choices'] ) ? $field['choices'] : null,
						'description' => isset( $field['description'] ) ? $field['description'] : null,
					] );
					break;
			}
		}
	}

	public function get_custom_css_code() {
		$options  = $this->get_customizer_options();
		$bg_color = $options['a11y_toggle_button_bg_color']; // get_theme_mod( 'a11y_toggle_button_bg_color', '#4054b2' );
		if ( ! empty( $bg_color ) ) {
			$this->add_css_rule( '#pojo-a11y-toolbar .pojo-a11y-toolbar-toggle a', 'background-color', $bg_color );
			$this->add_css_rule( '#pojo-a11y-toolbar .pojo-a11y-toolbar-overlay, #pojo-a11y-toolbar .pojo-a11y-toolbar-overlay ul.pojo-a11y-toolbar-items.pojo-a11y-links',
				'border-color', $bg_color );
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
			$this->css_rules[ $selector ] = [];
		}
		$this->css_rules[ $selector ][] = $rule . ': ' . $value . ';';
	}

	private function add_css_code( $code ) {
		$this->css_code .= "\n" . $code;
	}

	public function print_css_code() {
		$this->get_custom_css_code();
		$css = '';
		foreach ( $this->css_rules as $selector => $css_rules ) {
			$css .= "\n" . $selector . '{ ' . implode( "\t", $css_rules ) . '}';
		}
		echo '<style type="text/css">' . $css . $this->css_code . '</style>';
	}

	public function __construct() {
		add_filter( 'customize_register', [ $this, 'customize_a11y' ], 610 );
		add_filter( 'wp_head', [ $this, 'print_css_code' ] );
	}
}
