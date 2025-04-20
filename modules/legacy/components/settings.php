<?php

namespace EA11y\Modules\Legacy\Components;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Settings
 */
class Settings {
	public $menu_slug = null;

	const PAGE_ID = 'pojo-a11y';
	const SETTINGS_PAGE = 'toplevel_page_accessibility-settings';
	const TOOLBAR_PAGE = 'accessibility_page_accessibility-toolbar';
	const FIELD_TEXT = 'text';
	const FIELD_SELECT = 'select';
	const FIELD_CHECKBOX_LIST = 'checkbox_list';

	protected $_fields = [];

	protected $_sections = [];
	protected $_defaults = [];
	protected $_pages = [];
	public $_page_title = '';
	public $_page_menu_title = '';
	public $_menu_parent = '';


	/**
	 * Setup Toolbar fields
	 *
	 * @param array $sections
	 *
	 * @return array
	 */
	public function section_a11y_toolbar( $sections = [] ) {
		$fields = [];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar',
			'title'   => __( 'Display Toolbar', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'options' => [
				'enable'          => __( 'Show on all devices', 'pojo-accessibility' ),
				'visible-desktop' => __( 'Visible Desktop', 'pojo-accessibility' ),
				'visible-tablet'  => __( 'Visible Tablet', 'pojo-accessibility' ),
				'visible-phone'   => __( 'Visible Phone', 'pojo-accessibility' ),
				'hidden-desktop'  => __( 'Hidden Desktop', 'pojo-accessibility' ),
				'hidden-tablet'   => __( 'Hidden Tablet', 'pojo-accessibility' ),
				'hidden-phone'    => __( 'Hidden Phone', 'pojo-accessibility' ),
				'disable'         => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_toolbar_display' ],
		];

		$toolbar_options_classes = 'pojo-a11y-toolbar-button';

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_title',
			'title' => __( 'Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'desc'  => __( 'Title top of the toolbar (recommended).', 'pojo-accessibility' ),
			'class' => $toolbar_options_classes,
			'std'   => __( 'Accessibility Tools', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_resize_font',
			'title'   => __( 'Resize Font', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_resize_font_add_title',
			'title' => __( 'Increase Text', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row no-border',
			'std'   => __( 'Increase Text', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_resize_font_less_title',
			'title' => __( 'Decrease Text', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'Decrease Text', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_grayscale',
			'title'   => __( 'Grayscale', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_grayscale_title',
			'title' => __( 'Grayscale Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'Grayscale', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_high_contrast',
			'title'   => __( 'High Contrast', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_high_contrast_title',
			'title' => __( 'High Contrast Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'High Contrast', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_negative_contrast',
			'title'   => __( 'Negative Contrast', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_negative_contrast_title',
			'title' => __( 'Negative Contrast Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'Negative Contrast', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_light_bg',
			'title'   => __( 'Light Background', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_light_bg_title',
			'title' => __( 'Light Background Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'Light Background', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_links_underline',
			'title'   => __( 'Links Underline', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_links_underline_title',
			'title' => __( 'Links Underline Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'Links Underline', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_toolbar_button_readable_font',
			'title'   => __( 'Readable Font', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'class'   => $toolbar_options_classes,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_readable_font_title',
			'title' => __( 'Readable Font Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'   => __( 'Readable Font', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_sitemap_title',
			'title' => __( 'Sitemap Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes,
			'std'   => __( 'Sitemap', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'          => 'pojo_a11y_toolbar_button_sitemap_link',
			'title'       => __( 'Sitemap Link', 'pojo-accessibility' ),
			'type'        => self::FIELD_TEXT,
			'placeholder' => 'https://your-domain.com/sitemap',
			'desc'        => __( 'Link for sitemap page in your website. Leave blank to disable.', 'pojo-accessibility' ),
			'class'       => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'         => '',
			'sanitize_callback' => 'sanitize_url',
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_help_title',
			'title' => __( 'Help Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes,
			'std'   => __( 'Help', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'          => 'pojo_a11y_toolbar_button_help_link',
			'title'       => __( 'Help Link', 'pojo-accessibility' ),
			'type'        => self::FIELD_TEXT,
			'placeholder' => 'https://your-domain.com/help',
			'desc'        => __( 'Link for help page in your website. Leave blank to disable.', 'pojo-accessibility' ),
			'class'       => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'         => '',
			'sanitize_callback' => 'sanitize_url',
		];

		$fields[] = [
			'id'    => 'pojo_a11y_toolbar_button_feedback_title',
			'title' => __( 'Feedback Title', 'pojo-accessibility' ),
			'type'  => self::FIELD_TEXT,
			'class' => $toolbar_options_classes,
			'std'   => __( 'Feedback', 'pojo-accessibility' ),
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'          => 'pojo_a11y_toolbar_button_feedback_link',
			'title'       => __( 'Feedback Link', 'pojo-accessibility' ),
			'type'        => self::FIELD_TEXT,
			'placeholder' => 'https://your-domain.com/feedback',
			'desc'        => __( 'Link for feedback page in your website. Leave blank to disable.', 'pojo-accessibility' ),
			'class'       => $toolbar_options_classes . ' pojo-settings-child-row',
			'std'         => '',
			'sanitize_callback' => 'sanitize_url',
		];

		$sections[] = [
			'id'     => 'section-a11y-toolbar',
			'page'   => self::TOOLBAR_PAGE,
			'title'  => __( 'Toolbar Settings', 'pojo-accessibility' ),
			'intro'  => '',
			'fields' => $fields,
		];

		$sections[] = [
			'id'     => 'section-a11y-styles',
			'page'   => self::TOOLBAR_PAGE,
			'title'  => __( 'Style Settings', 'pojo-accessibility' ),
			'intro'  => sprintf( __( 'For style settings of accessibility tools go to > Customize > <a href="%s">Accessibility</a>.', 'pojo-accessibility' ),
				$this->get_admin_url( 'customizer' )
			),
			'fields' => [],
		];

		return $sections;
	}

	public function section_a11y_settings( $sections ) {
		$fields = [];

		$fields[] = [
			'id'      => 'pojo_a11y_focusable',
			'title'   => __( 'Add Outline Focus', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'desc'    => __( 'Add outline to elements on keyboard focus.', 'pojo-accessibility' ),
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'disable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'      => 'pojo_a11y_skip_to_content_link',
			'title'   => __( 'Skip to Content link', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'desc'    => __( 'Add skip to content link when using keyboard.', 'pojo-accessibility' ),
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'          => 'pojo_a11y_skip_to_content_link_element_id',
			'title'       => __( 'Skip to Content Element ID', 'pojo-accessibility' ),
			'placeholder' => 'content',
			'type'        => self::FIELD_TEXT,
			'std'         => 'content',
			'sanitize_callback' => 'sanitize_text_field',
		];

		$fields[] = [
			'id'      => 'pojo_a11y_remove_link_target',
			'title'   => __( 'Remove target attribute from links', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'desc'    => __( 'This option will reset all your target links to open in the same window or tab.',
				'pojo-accessibility' ),
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'disable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'      => 'pojo_a11y_add_role_links',
			'title'   => __( 'Add landmark roles to all links', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'desc'    => __( 'This option will add <code>role="link"</code> to all links on the page.', 'pojo-accessibility' ),
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'      => 'pojo_a11y_save',
			'title'   => __( 'Sitewide Accessibility', 'pojo-accessibility' ),
			'desc'    => __( 'Consistent accessibility throughout your site visit. Site remembers you and stays accessible.', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'options' => [
				'enable'  => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			],
			'std'     => 'enable',
			'sanitize_callback' => [ $this, 'sanitize_enabled_disabled' ],
		];

		$fields[] = [
			'id'      => 'pojo_a11y_save_expiration',
			'title'   => __( 'Remember user for', 'pojo-accessibility' ),
			'type'    => self::FIELD_SELECT,
			'desc'    => __( 'Define how long your toolbar settings will be remembered', 'pojo-accessibility' ),
			'options' => [
				'1'   => __( '1 Hour', 'pojo-accessibility' ),
				'6'   => __( '6 Hours', 'pojo-accessibility' ),
				'12'  => __( '12 Hours', 'pojo-accessibility' ),
				'24'  => __( '1 Day', 'pojo-accessibility' ),
				'48'  => __( '2 Days', 'pojo-accessibility' ),
				'72'  => __( '3 Days', 'pojo-accessibility' ),
				'168' => __( '1 Week', 'pojo-accessibility' ),
				'720' => __( '1 Month', 'pojo-accessibility' ),
			],
			'std'     => '12',
			'sanitize_callback' => [ $this, 'sanitize_expiration' ],
		];

		$sections[] = [
			'id'     => 'section-a11y-settings',
			'page'   => self::SETTINGS_PAGE,
			'title'  => __( 'General Settings', 'pojo-accessibility' ),
			'intro'  => '',
			'fields' => $fields,
		];

		return $sections;
	}

	public function print_js() {
		// TODO: Maybe need to move to other file
		?>
		<script>
			jQuery( document ).ready( function ( $ ) {
				var $a11yToolbarOption = $( 'table.form-table #pojo_a11y_toolbar' ),
					$a11yToolbarButtons = $( 'tr.pojo-a11y-toolbar-button' );

				$a11yToolbarOption.on( 'change', function () {
					if ( 'disable' !== $( this ).val() ) {
						$a11yToolbarButtons.fadeIn( 'fast' );
					} else {
						$a11yToolbarButtons.hide();
					}
				} );
				$a11yToolbarOption.trigger( 'change' );
			} );
		</script>
		<?php
	}

	public function get_settings_sections() {
		$sections        = [];
		$sections        = $this->section_a11y_toolbar( $sections );
		$sections        = $this->section_a11y_settings( $sections );
		$this->_sections = $sections;

		return $this->_sections;
	}

	public function add_settings_section( $args = [] ) {
		$args = wp_parse_args( $args, [
			'id'    => '',
			'title' => '',
		] );

		foreach ( $this->_sections as $section ) {
			if ( $args['id'] !== $section['id'] ) {
				continue;
			}
			if ( empty( $section['intro'] ) ) {
				return;
			}
			printf( '<p>%s</p>', $section['intro'] );
			break;
		}
	}

	public function add_settings_field( $args = [] ) {
		if ( empty( $args ) ) {
			return;
		}

		$args = wp_parse_args( $args, [
			'id'   => '',
			'std'  => '',
			'type' => self::FIELD_TEXT,
		] );

		if ( empty( $args['id'] ) || empty( $args['type'] ) ) {
			return;
		}

		$field_callback = 'render_' . $args['type'] . '_field';
		if ( method_exists( $this, $field_callback ) ) {
			call_user_func( [ $this, $field_callback ], $args );
		}
	}

	public function render_select_field( $field ) {
		$options = [];
		foreach ( $field['options'] as $option_key => $option_value ) {
			$options[] = sprintf(
				'<option value="%1$s"%2$s>%3$s</option>',
				esc_attr( $option_key ),
				selected( get_option( $field['id'], $field['std'] ), $option_key, false ),
				$option_value
			);
		}
		?>
		<select id="<?php echo $field['id']; ?>" name="<?php echo $field['id']; ?>">
			<?php echo implode( '', $options ); ?>
		</select>
		<?php if ( ! empty( $field['sub_desc'] ) ) {
			echo $field['sub_desc'];
		} ?>
		<?php if ( ! empty( $field['desc'] ) ) : ?>
			<p class="description"><?php echo $field['desc']; ?></p>
		<?php endif; ?>
		<?php
	}

	public function render_text_field( $field ) {
		if ( empty( $field['classes'] ) ) {
			$field['classes'] = [ 'regular-text' ];
		}
		?>
		<input type="text" class="<?php echo implode( ' ', $field['classes'] ); ?>" id="<?php echo $field['id']; ?>"
			   name="<?php echo $field['id']; ?>" value="<?php echo esc_attr( get_option( $field['id'],
			$field['std'] ) ); ?>"<?php echo ! empty( $field['placeholder'] ) ? ' placeholder="' . $field['placeholder'] . '"' : ''; ?> />
		<?php if ( ! empty( $field['sub_desc'] ) ) {
			echo $field['sub_desc'];
		} ?>
		<?php if ( ! empty( $field['desc'] ) ) : ?>
			<p class="description"><?php echo $field['desc']; ?></p>
		<?php endif; ?>
		<?php
	}

	public function admin_init() {
		foreach ( $this->get_settings_sections() as $section_key => $section ) {
			add_settings_section(
				$section['id'],
				$section['title'],
				[ &$this, 'add_settings_section' ],
				$section['page']
			);

			if ( empty( $section['fields'] ) ) {
				continue;
			}

			foreach ( $section['fields'] as $field ) {
				add_settings_field(
					$field['id'],
					$field['title'],
					[ &$this, 'add_settings_field' ],
					$section['page'],
					$section['id'],
					$field
				);

				$sanitize_callback = [ $this, 'field_html' ];
				if ( ! empty( $field['type'] ) && self::FIELD_CHECKBOX_LIST === $field['type'] ) {
					$sanitize_callback = [ $this, 'field_checkbox_list' ];
				}
				if ( ! empty( $field['sanitize_callback'] ) ) {
					$sanitize_callback = $field['sanitize_callback'];
				}

				register_setting( $section['page'], $field['id'], $sanitize_callback );
			}
		}
	}

	public static function field_html( $input ) {
		return stripslashes( wp_filter_post_kses( addslashes( $input ) ) );
	}

	public function sanitize_toolbar_display( $input ) {
		if ( empty( $input ) ) {
			return $input;
		}

		return in_array( $input, [ 'enable', 'visible-desktop', 'visible-tablet', 'visible-phone', 'hidden-desktop', 'hidden-tablet', 'hidden-phone', 'disable' ] ) ? $input : 'enable';
	}

	public function sanitize_enabled_disabled( $input ) {
		if ( empty( $input ) ) {
			return $input;
		}

		return in_array( $input, [ 'enable', 'disable' ] ) ? $input : '';
	}

	public function sanitize_expiration( $input ) {
		if ( empty( $input ) ) {
			$input = [];
		}

		return in_array( $input, [ '1' , '6' , '12', '24', '48', '72' , '168', '720' ] ) ? $input : '12';
	}

	public static function field_checkbox_list( $input ) {
		if ( empty( $input ) ) {
			$input = [];
		}

		return $input;
	}

	public function display_settings_page() {
		$screen    = get_current_screen();
		$screen_id = $screen->id;
		if ( false !== strpos( $screen_id, 'toolbar' ) ) {
			$screen_id = self::TOOLBAR_PAGE;
		}
		?>
		<div class="wrap">
			<h2><?php echo $this->_page_title; ?></h2>
			<?php settings_errors( $screen_id ); ?>
			<form method="post" action="options.php">
				<?php
				settings_fields( $screen_id );
				do_settings_sections( $screen_id );

				submit_button();
				?>
			</form>

		</div><!-- /.wrap -->
		<?php
	}

	public function admin_menu() {
		$this->menu_slug = add_menu_page(
			__( 'Accessibility', 'pojo-accessibility' ),
			__( 'Accessibility', 'pojo-accessibility' ) . ' <span class="awaiting-mod"></span>',
			'manage_options',
			'accessibility-settings',
			[ &$this, 'display_settings_page' ],
			'dashicons-universal-access-alt'
		);
		add_submenu_page(
			'accessibility-settings',
			__( 'Accessibility Settings', 'pojo-accessibility' ),
			__( 'Settings', 'pojo-accessibility' ),
			'manage_options',
			'accessibility-settings',
			[ &$this, 'display_settings_page' ]
		);
		add_submenu_page(
			'accessibility-settings',
			__( 'Accessibility Toolbar', 'pojo-accessibility' ),
			__( 'Toolbar', 'pojo-accessibility' ),
			'manage_options',
			'accessibility-toolbar',
			[ &$this, 'display_settings_page' ]
		);
		add_submenu_page(
			'accessibility-settings',
			__( 'Customize', 'pojo-accessibility' ),
			__( 'Customize', 'pojo-accessibility' ),
			'manage_options',
			'/customize.php?autofocus[section]=accessibility'
		);
	}

	public function plugin_action_links( $links, $plugin_file ) {
		if ( EA11Y_BASE === $plugin_file ) {
			$settings   = '<a href="' . $this->get_admin_url( 'general' ) . '" aria-label="' . esc_attr__( 'Set Accessibility settings',
					'pojo-accessibility' ) . '">' . __( 'Settings', 'pojo-accessibility' ) . '</a>';
			$toolbar    = '<a href="' . $this->get_admin_url( 'toolbar' ) . '" aria-label="' . esc_attr__( 'Set Accessibility Toolbar Settings',
					'pojo-accessibility' ) . '">' . __( 'Toolbar', 'pojo-accessibility' ) . '</a>';
			$customizer = '<a href="' . $this->get_admin_url( 'customizer' ) . '" aria-label="' . esc_attr__( 'Customize Toolbar',
					'pojo-accessibility' ) . '" target="_blank">' . __( 'Customize', 'pojo-accessibility' ) . '</a>';
			array_unshift( $links, $customizer );
			array_unshift( $links, $toolbar );
			array_unshift( $links, $settings );
		}

		return $links;
	}

	private function get_admin_url( $type ) {
		switch ( $type ) {
			case 'customizer':
				return admin_url( 'customize.php?autofocus[section]=accessibility' );
				break;
			case 'general':
				return admin_url( 'admin.php?page=accessibility-settings' );
				break;
			case 'toolbar':
				return admin_url( 'admin.php?page=accessibility-toolbar' );
				break;
		}
	}

	private function get_default_values() {
		if ( empty( $this->_defaults ) ) {
			if ( empty( $this->_sections ) ) {
				$this->get_settings_sections();
			}
			$defaults = [];
			foreach ( $this->_sections as $section ) {
				foreach ( $section['fields'] as $field ) {
					$defaults[ $field['id'] ] = isset( $field['std'] ) ? $field['std'] : '';
				}
			}
			$this->_defaults = $defaults;
		}
	}

	public function get_default_title_text( $option ) {
		$this->get_default_values();
		$default = isset( $this->_defaults[ $option ] ) ? $this->_defaults[ $option ] : '';

		return get_option( $option, $default );
	}

	public function __construct() {
		$this->_page_title      = __( 'One Click Accessibility', 'pojo-accessibility' );
		$this->_page_menu_title = __( 'One Click Accessibility', 'pojo-accessibility' );
		$this->_menu_parent     = 'themes.php';

		add_action( 'admin_menu', [ &$this, 'admin_menu' ], 20 );
		add_action( 'admin_init', [ &$this, 'admin_init' ], 20 );
		add_action( 'admin_footer', [ &$this, 'print_js' ] );
		add_filter( 'plugin_action_links_' . EA11Y_BASE, [ $this, 'plugin_action_links' ], 10, 2 );
	}
}
