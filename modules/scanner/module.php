<?php

namespace EA11y\Modules\Scanner;

use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Modules\Connect\Module as Connect;
use EA11y\Modules\Remediation\Classes\Utils as Remediation_Utils;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Scanner\Database\Scan_Entry;
use EA11y\Modules\Scanner\Database\Scans_Table;
use EA11y\Modules\Settings\Classes\Settings;
use EA11y\Modules\Settings\Module as Settings_Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends Module_Base {

	public function get_name(): string {
		return 'scanner';
	}

	public static function routes_list(): array {
		return [
			'Generate_Alt_Text',
			'Scan_Results',
			'Resolve_With_AI',
			'Scanner_Stats',
			'Scanner_Post_Types',
			'Scanner_Results',
			'Resolve_Issue',
		];
	}

	public static function component_list(): array {
		return [
			'Top_Bar_Link',
			'List_Column',
		];
	}

	/**
	 * Get widget URL
	 * @return string
	 */
	public static function get_scanner_wizard_url() : string {
		return apply_filters( 'ea11y_scanner_wizard_url', 'https://cdn.elementor.com/a11y/scanner.js' );
	}

	/**
	 * Enqueue Scripts
	 */
	public function enqueue_assets() : void {
		if ( ! current_user_can( 'manage_options' ) || is_admin() || ! is_admin_bar_showing() ) {
			return;
		}

		if ( version_compare( get_bloginfo( 'version' ), '6.6', '<' ) ) {
			wp_register_script(
				'react-jsx-runtime',
				EA11Y_ASSETS_URL . 'lib/react-jsx-runtime.js',
				[ 'react' ],
				'18.3.0',
				true
			);
		}

		wp_enqueue_style(
			'ea11y-scanner-wizard',
			EA11Y_ASSETS_URL . 'build/ea11y-scanner-wizard.css',
			[],
			EA11Y_VERSION
		);

		Utils\Assets::enqueue_app_assets( 'scanner', false );

		$url = Remediation_Utils::get_current_page_url();

		$page = new Page_Entry([
			'by' => 'url',
			'value' => $url,
		]);

		$dismissed_heading_issues = get_post_meta( get_the_ID(), 'ea11y-scanner-heading-issues-dismissed', true );

		if ( ! $dismissed_heading_issues ) {
			$dismissed_heading_issues = [];
		}

		wp_localize_script(
			'scanner',
			'ea11yScannerData',
			[
				'wpRestNonce' => wp_create_nonce( 'wp_rest' ),
				'dashboardUrl' => admin_url( 'admin.php?page=accessibility-settings' ),
				'scannerUrl' => self::get_scanner_wizard_url(),
				'initialScanResult' => Scan_Entry::get_scan_result( $url ),
				'pageData' => [
					'url' => $url,
					'title' => Remediation_Utils::get_current_page_title(),
					'object_id' => Remediation_Utils::get_current_object_id(),
					'object_type' => Remediation_Utils::get_current_object_type(),
					'object_type_name' => Remediation_Utils::get_current_object_type_name(),
					'unregistered' => ! $page->exists(),
					'entry_id' => $page->id,
				],
				'planData' => Settings::get( Settings::PLAN_DATA ),
				'planScope' => Settings::get( Settings::PLAN_SCOPE ),
				'pluginEnv' => Settings_Module::get_plugin_env(),
				'pluginVersion' => EA11Y_VERSION,
				'isConnected' => Connect::is_connected(),
				'isRTL' => is_rtl(),
				'isDevelopment' => defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG,
				'dismissedHeadingIssues' => $dismissed_heading_issues,
			]
		);
	}

	public function enqueue_admin_styles() : void {
		wp_enqueue_style(
			'ea11y-scanner-admin-style',
			EA11Y_ASSETS_URL . 'build/ea11y-scanner-admin.css',
			[],
			EA11Y_VERSION
		);
	}

	public static function is_active(): bool {
		return (
			self::has_required_permissions() &&
			self::is_connected_and_enabled()
		);
	}

	private static function has_required_permissions(): bool {
		return is_user_logged_in() && current_user_can( 'manage_options' );
	}

	private static function is_connected_and_enabled(): bool {
		return Connect::is_connected() && ! \EA11y\Modules\Legacy\Module::is_active();
	}


	public function __construct() {
		Scans_Table::install();
		$this->register_routes();
		$this->register_components();

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_styles' ] );
	}
}
