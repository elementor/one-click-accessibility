<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Pojo_A11y_Settings extends Pojo_Settings_Page_Base {

	/**
	 * Setup Toolbar fields
	 * 
	 * @param array $sections
	 *
	 * @return array
	 */
	public function section_a11y_toolbar( $sections = array() ) {
		$fields = array();

		$fields[] = array(
			'id' => 'pojo_a11y_toolbar',
			'title' => __( 'Toolbar', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$toolbarButtonClasses = 'pojo-a11y-toolbar-button';
		
		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_position',
			'title' => __( 'Position', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'left' => __( 'Left', 'pojo-accessibility' ),
				'right' => __( 'Right', 'pojo-accessibility' ),
			),
			'std' => is_rtl() ? 'right' : 'left',
		);

		
		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_button_resize_font',
			'title' => __( 'Resize Font', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_button_grayscale',
			'title' => __( 'Grayscale', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_button_contrast',
			'title' => __( 'High Contrast', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_button_light_bg',
			'title' => __( 'Light Background', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_button_links_underline',
			'title' => __( 'Links Underline', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$fields[] = array(
			'id' => 'pojo_a11y_toolbar_button_readable_font',
			'title' => __( 'Readable Font', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'class' => $toolbarButtonClasses,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'enable',
		);

		$sections[] = array(
			'id' => 'section-a11y-toolbar',
			'page' => $this->_page_id,
			'title' => __( 'Toolbar Setting:', 'pojo-accessibility' ),
			'intro' => '',
			'fields' => $fields,
		);
		
		return $sections;
	}

	public function section_a11y_settings( $sections ) {
		$fields = array();

		$fields[] = array(
			'id' => 'pojo_a11y_remove_link_target',
			'title' => __( 'Remove target attribute from links', 'pojo-accessibility' ),
			'type' => Pojo_Settings::FIELD_SELECT,
			'options' => array(
				'enable' => __( 'Enable', 'pojo-accessibility' ),
				'disable' => __( 'Disable', 'pojo-accessibility' ),
			),
			'std' => 'disable',
		);
		
		
		$sections[] = array(
			'id' => 'section-a11y-settings',
			'page' => $this->_page_id,
			'title' => __( 'Settings:', 'pojo-accessibility' ),
			'intro' => '',
			'fields' => $fields,
		);

		return $sections;
	}

	public function print_js() {
		// TODO: Maybe need to move to other file
		?>
		<script>
			jQuery( document ).ready( function( $ ) {
				var $a11yToolbarOption = $( 'table.form-table #pojo_a11y_toolbar' ),
					$a11yToolbarButtons = $( 'tr.pojo-a11y-toolbar-button' );
				
				$a11yToolbarOption.on( 'change', function() {
					if ( 'enable' === $( this ).val() ) {
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

	public function __construct( $priority = 10 ) {
		$this->_page_id = 'pojo-a11y';
		$this->_page_title = __( 'Accessibility Settings', 'pojo-accessibility' );
		$this->_page_menu_title = __( 'Accessibility', 'pojo-accessibility' );
		$this->_page_type = 'submenu';
		$this->_page_parent = 'pojo-home';

		add_filter( 'pojo_register_settings_sections', array( &$this, 'section_a11y_toolbar' ), 100 );
		add_filter( 'pojo_register_settings_sections', array( &$this, 'section_a11y_settings' ), 110 );
		
		add_action( 'admin_footer', array( &$this, 'print_js' ) );

		parent::__construct( $priority );
	}
	
}