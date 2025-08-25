<?php

namespace EA11y\Modules\Widget;

use EA11y\Classes\Module_Base;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Settings\Module as SettingsModule;
use EA11y\Modules\Analytics\Module as AnalyticsModule;
use EA11y\Modules\Settings\Classes\Settings;
use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'widget';
	}

	/**
	 * Enqueue scripts
	 *
	 * @return void
	 * @throws Exception
	 */
	public function enqueue_accessibility_widget() : void {
		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		wp_enqueue_script(
			'ea11y-widget',
			self::get_widget_url() . '?api_key=' . $plan_data->public_api_key,
			[],
			EA11Y_VERSION,
			true
		);

		wp_enqueue_style(
			'ea11y-widget-fonts',
			EA11Y_ASSETS_URL . 'build/fonts.css',
			[],
			EA11Y_VERSION
		);

		$is_analytics_enabled = AnalyticsModule::is_active();

		wp_localize_script(
			'ea11y-widget',
			'ea11yWidget',
			[
				'iconSettings' => get_option( Settings::WIDGET_ICON_SETTINGS ),
				'toolsSettings' => $this->get_tools_settings(),
				'accessibilityStatementURL' => $this->get_accessibility_statement_url(),
				'analytics' => [
					'enabled' => $is_analytics_enabled,
					'url' => $is_analytics_enabled ? get_rest_url( null, '/ea11y/v1/analytics/events' ) : null,
				],
			]
		);
	}

	/**
	 * Get widget URL
	 * @return string
	 */
	public static function get_widget_url() : string {
		return apply_filters( 'ea11y_widget_url', 'https://cdn.elementor.com/a11y/widget.js' );
	}

	/**
	 * Get accessibility statement URL
	 * @return string
	 */
	public function get_accessibility_statement_url() : string {
		$option = get_option( 'ea11y_accessibility_statement_data' );

		if ( ! empty( $option ) && ! empty( $option['link'] ) && empty( $option['hideLink'] ) ) {
			return $option['link'];
		}

		return '';
	}

	/**
	 * Load scripts in admin
	 * @param $hook
	 *
	 * @return void
	 */
	public function enqueue_accessibility_widget_admin( $hook ) : void {
		if ( SettingsModule::SETTING_PAGE_SLUG !== $hook ) {
			return;
		}

		if ( ! Connect::is_connected() ) {
			return;
		}

		$plan_data = Settings::get( Settings::PLAN_DATA );

		if ( ! isset( $plan_data->public_api_key ) ) {
			return;
		}

		$widget_state = [
			'iconSettings' => $this->get_widget_icon_settings(),
			'toolsSettings' => $this->get_tools_settings(),
			'preview' => true,
			'previewContainer' => '#ea11y-widget-preview--container',
			'apiKey' => $plan_data->public_api_key,
			'accessibilityStatementURL' => $this->get_accessibility_statement_url(),
		];

		?>

	<script id="ea11y-state">
		window.ea11yWidget = <?php echo json_encode( $widget_state ); ?>;
	</script>

		<?php
	}

		/**
		 * Get widget's tools/menu settings
		 * @return array|mixed
		 */
	public function get_tools_settings() {
			// Features to check
			$features = [ 'screen_reader', 'remove_elementor_label' ];

			// Get the data from the settings
			$widget_settings = Settings::get( Settings::WIDGET_MENU_SETTINGS );
			$plan_data = Settings::get( Settings::PLAN_DATA );

			// Return settings if features object in not present in plan data.
		if ( ! isset( $plan_data->plan->features ) ) {
				return $widget_settings;
		}

			// Check if the feature is available in the plan
		foreach ( $features as $feature ) {
				$feature_name = str_replace( '_', '-', $feature );

				// Assuming feature does not exist in the plan.
				$feature_in_plan_data = false;

				// Check if it exists in the plan. A contingency to handle downgrading of plans.
			if ( isset( $plan_data->plan->features->{$feature} ) ) {
				if ( $plan_data->plan->features->{$feature} ) {
					$feature_in_plan_data = $plan_data->plan->features->{$feature};
				} else {
						// Auto disable plan if it is set to false in the plan data.
						$widget_settings[ $feature_name ]['enabled'] = false;
						Settings::set( Settings::WIDGET_MENU_SETTINGS, $widget_settings );
				}
			} else {
					continue;
			}

				$feature_in_widget_settings = isset( $widget_settings[ $feature_name ] );

			if ( ! $feature_in_plan_data && $feature_in_widget_settings ) {
						  $widget_settings[ $feature_name ]['enabled'] = false;
			}
		}

			return $widget_settings;
	}

	/**
	 * Remove person object from the icon settings for frontend.
	 * @return array
	 */
	public function get_widget_icon_settings() : array {
		$option = get_option( 'ea11y_widget_icon_settings' );

		if ( ! $option ) {
			return [];
		}

		unset( $option['style']['icon'] );

		return $option;
	}

	public static function component_list(): array {
		return [
			'Cache_Compatibility',
			'Gutenberg_Link',
		];
	}

	public function script_loader_tag( $tag, $handle, $src ) {
		if ( 'ea11y-widget' === $handle ) {
			$tag = str_replace( '><', 'referrerPolicy="origin"><', $tag );
		}

		return $tag;
	}

	/**
	 * register_dynamic_tag
	 * @param \Elementor\Core\DynamicTags\Manager $dynamic_tags_manager
	 */
	public function register_dynamic_tag( $dynamic_tags_manager ) {
		$dynamic_tags_manager->register( new Components\Ally_Trigger() );
	}

	public function render_dynamic_tag_handler() {
		?>
			<script>
				const registerAllyAction = () => {
					if ( ! window?.elementorAppConfig?.hasPro || ! window?.elementorFrontend?.utils?.urlActions ) {
						return;
					}

					elementorFrontend.utils.urlActions.addAction( 'allyWidget:open', () => {
						if ( window?.ea11yWidget?.widget?.open ) {
							window.ea11yWidget.widget.open();
						}
					} );
				};

				const waitingLimit = 30;
				let retryCounter = 0;

				const waitForElementorPro = () => {
					return new Promise( ( resolve ) => {
						const intervalId = setInterval( () => {
							if ( retryCounter === waitingLimit ) {
								resolve( null );
							}

							retryCounter++;

							if ( window.elementorFrontend && window?.elementorFrontend?.utils?.urlActions ) {
								clearInterval( intervalId );
								resolve( window.elementorFrontend );
							}
								}, 100 ); // Check every 100 milliseconds for availability of elementorFrontend
					});
				};

				waitForElementorPro().then( () => { registerAllyAction(); });
			</script>
			<?php
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		$this->register_components();

		add_action( 'wp_footer', [ $this, 'render_dynamic_tag_handler' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_accessibility_widget' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_accessibility_widget_admin' ] );
		// Add referrer policy to widget script tag
		add_filter( 'script_loader_tag', [ $this, 'script_loader_tag' ], 10, 3 );

		// elementor dynamic tag
		add_action( 'elementor/dynamic_tags/register', [ $this, 'register_dynamic_tag' ] );
	}
}
