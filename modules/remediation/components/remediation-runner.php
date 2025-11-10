<?php

namespace EA11y\Modules\Remediation\Components;

use DOMDocument;
use EA11y\Classes\Logger;
use EA11y\Modules\Remediation\Classes\Utils;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Page_Table;
use EA11y\Modules\Remediation\Database\Remediation_Entry;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Remediation_Runner
 */
class Remediation_Runner {
	public Page_Entry $page;
	public array $page_remediations = [];
	public ?string $page_html = '';
	public array $front_end_remediations = [];

	public function get_remediation_classes() : array {
		static $classes = null;
		if ( null === $classes ) {
			$classes = apply_filters( 'ea11y_remediations_classes', [
				'ATTRIBUTE' => 'Attribute',
				'ELEMENT'   => 'Element',
				'REPLACE' => 'Replace',
				'STYLES' => 'Styles',
			] );
		}
		return $classes;
	}

	/**
	 * Detect AJAX requests that go through template_redirect hook
	 *
	 * Only detects frontend AJAX requests that would interfere with template_redirect,
	 * not admin-ajax.php requests which bypass the main query cycle.
	 *
	 * @return bool True if a template_redirect-affecting AJAX request is detected
	 */
	private function is_template_redirect_ajax_request(): bool {
		global $wp_query;

		// Skip admin-ajax.php requests - they don't go through template_redirect
		$request_uri = $_SERVER['REQUEST_URI'] ?? '';
		if ( strpos( $request_uri, '/wp-admin/admin-ajax.php' ) !== false ) {
			return false;
		}

		// WooCommerce frontend AJAX (wc-ajax parameter)
		// These requests go through the main query cycle and template_redirect
		if ( ! empty( $_REQUEST['wc-ajax'] ) ) {
			return true;
		}

		// Check if WP_Query has wc-ajax set (WooCommerce frontend AJAX)
		if ( is_object( $wp_query ) && $wp_query->get( 'wc-ajax' ) ) {
			return true;
		}

		// WooCommerce AJAX constant for frontend requests
		if ( defined( 'WC_DOING_AJAX' ) && constant( 'WC_DOING_AJAX' ) ) {
			return true;
		}

		// REST API requests that go through template_redirect
		if ( defined( 'REST_REQUEST' ) && constant( 'REST_REQUEST' ) ) {
			return true;
		}

		// Check URL patterns for REST API (these go through template_redirect)
		if ( strpos( $request_uri, '/wp-json/' ) !== false ||
			 strpos( $request_uri, '?rest_route=' ) !== false ) {
			return true;
		}

		// WooCommerce Store API (frontend cart/checkout AJAX)
		if ( strpos( $request_uri, '/wc/store/' ) !== false ) {
			return true;
		}

		// Elementor frontend AJAX/preview that affects template loading
		if ( ! empty( $_REQUEST['elementor-preview'] ) ||
			 ! empty( $_GET['elementor-preview'] ) ) {
			return true;
		}

		// Divi Visual Builder edit mode (et_fb parameter)
		if ( ! empty( $_REQUEST['et_fb'] ) ||
			! empty( $_GET['et_fb'] ) ) {
			return true;
		}

		// Check for AJAX header on frontend requests (not admin)
		// Only if it's not an admin request and has AJAX header
		if ( ! is_admin() &&
			 ! empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) &&
			 strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) === 'xmlhttprequest' ) {

			// Additional check: make sure it's not a heartbeat or other admin request
			$action = $_REQUEST['action'] ?? '';
			if ( $action !== 'heartbeat' && strpos( $action, 'wp_ajax_' ) !== 0 ) {
				return true;
			}
		}

		// Custom AJAX parameters that indicate frontend AJAX
		$frontend_ajax_params = [
			'ajax_request',
			'is_ajax',
			'doing_ajax',
		];

		foreach ( $frontend_ajax_params as $param ) {
			if ( ! empty( $_REQUEST[ $param ] ) ) {
				return true;
			}
		}

		// Query string patterns for frontend AJAX
		$query_string = $_SERVER['QUERY_STRING'] ?? '';
		$frontend_ajax_patterns = [
			'ajax=true',
			'is_ajax=1',
			'ajax_request=1',
		];

		foreach ( $frontend_ajax_patterns as $pattern ) {
			if ( strpos( $query_string, $pattern ) !== false ) {
				return true;
			}
		}

		return false;
	}

	private function should_run_remediation(): bool {
		// Skip remediation during template_redirect AJAX requests
		if ( $this->is_template_redirect_ajax_request() ) {
			return false;
		}

		try {
			$current_url = Utils::get_current_page_url();
			$this->page = new Page_Entry([
				'by' => 'url',
				'value' => $current_url,
			]);

			$this->page_html = $this->page->get_page_html();
			$this->page_remediations = Remediation_Entry::get_page_active_remediations( $current_url );
			$status = $this->page->__get( Page_Table::STATUS );

			if ( empty( $this->page_remediations ) || Page_Table::STATUSES['ACTIVE'] !== $status ) {
				return false;
			}
			return true;
		} catch ( Throwable $t ) {
			Logger::error( $t->getMessage() );
			return false;
		}
	}

	public function start() {
		ob_start( [ $this, 'run_remediations' ] );
	}

	private function get_remediation_class_name( $type ) {
		$classes = $this->get_remediation_classes();
		$type = strtoupper( $type );
		if ( ! isset( $classes[ $type ] ) ) {
			return false;
		}
		$class = 'EA11y\\Modules\\Remediation\\Actions\\' . $classes[ $type ];
		return $class;
	}

	public function run_remediations( $buffer ): string {
		$is_params_empty = empty( $_POST ) && empty( $_GET );
		if ( ! is_user_logged_in() && $this->page_html && $this->page->is_valid_hash() && $is_params_empty ) {
			return $this->page_html;
		}

		$dom = $this->generate_remediation_dom( $buffer );

		if ( ! is_user_logged_in() && $is_params_empty ) {
			$this->page->update_html( $dom );
		}
		return $dom;
	}

	private function generate_remediation_dom( $buffer ): string {
		$dom = new DOMDocument( '1.0', 'UTF-8' );
		$dom->loadHTML( $buffer, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR );

		//Remove admin-bar for correct replace
		$admin_bar = $dom->getElementById( 'wpadminbar' );
		if ( $admin_bar ) {
			$parent = $admin_bar->parentNode;
			$next_sibling = $admin_bar->nextSibling;
			$removed_admin_bar = $parent->removeChild( $admin_bar );
		}

		$classes = $this->get_remediation_classes();
		foreach ( $this->page_remediations as $item ) {
			$remediation = json_decode( $item->content, true );
			$remediation['global'] = $item->global;

			if ( $item->global && ! $item->active_for_page ) {
				continue;
			}

			if ( ! isset( $classes[ strtoupper( $remediation['type'] ) ] ) ) {
				continue;
			}

			$remediation_class_name = $this->get_remediation_class_name( $remediation['type'] );
			$remediation_class = new $remediation_class_name( $dom, $remediation );
			if ( $remediation_class->use_frontend ) {
				$this->add_frontend_remediation( $remediation );
				continue;
			}
			if ( $remediation_class->dom ) {
				$remediation_class->dom = $dom;
			}
		}

		if ( isset( $removed_admin_bar, $parent ) ) {
			isset( $next_sibling ) && $next_sibling
				? $parent->insertBefore( $removed_admin_bar, $next_sibling )
				: $parent->appendChild( $removed_admin_bar );
		}

		// Add frontend remediations for dynamic content
		// We don't use Enqueue_Script because we need to add the script to
		// The <head> section and WP has already enqueued head scripts by now.
		if ( ! empty( $this->front_end_remediations ) ) {
			// Create a new <script> element
			$script_data = $dom->createElement( 'script' );
			$script_data->setAttribute( 'type', 'text/javascript' );
			$script_data->textContent = 'window.AllyRemediations = ' . wp_json_encode( [
				'remediations' => $this->front_end_remediations,
			], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ) . ';';

			// Create a new <script> element for the module.js
			$module_script = $dom->createElement( 'script' );
			$module_script->setAttribute( 'type', 'text/javascript' ); // Optional: specify the type
			$module_script->setAttribute( 'src', \EA11Y_ASSETS_URL . 'build/remediation-module.js' ); // Set the script source

			// Append the <script> elements to the <head> section
			$head = $dom->getElementsByTagName( 'head' )->item( 0 );
			if ( $head ) {
				$head->appendChild( $script_data );
				$head->appendChild( $module_script );
			}
		}
		return $dom->saveHTML();
	}

	private function add_frontend_remediation( $remediation ) {
		$this->front_end_remediations[] = $remediation;
	}

	public function __construct() {
		if ( is_admin() ) {
			return;
		}

		if ( $this->should_run_remediation() ) {
			add_action( 'template_redirect', [ $this, 'start' ], -9999 );
		}
	}
}
