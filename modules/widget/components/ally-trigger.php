<?php
namespace EA11y\Modules\Widget\Components;

use Elementor\Core\DynamicTags\Data_Tag;
use Elementor\Modules\DynamicTags\Module as TagsModule;

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
		add_action( 'wp_footer', function() {
			?>
			<script>
				const registerAllyAction = () => {
					elementorFrontend.utils.urlActions.addAction( 'allyWidget:open', settings => {
						if( window?.ea11yWidget?.widget?.open ){
							window.ea11yWidget.widget.open();
						}
					} );
				};
				const waitForElementorPro = () => {
					return new Promise( ( resolve, reject ) => {
						const intervalId = setInterval( () => {
							if ( window.elementorFrontend ) {
								clearInterval( intervalId );
								resolve( window.elementorFrontend );
							}
						}, 100 ); // Check every 100 milliseconds for availability of elementorFrontend
					});
				};
				waitForElementorPro().then( ( elementorFrontend ) => { registerAllyAction(); });
			</script>
			<?php
		} );
		return \Elementor\Plugin::instance()->frontend->create_action_hash( 'allyWidget:open', [] );
	}
}
