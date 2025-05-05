<?php

namespace EA11y\Modules\Remediation\Components;

use DOMDocument;
use EA11y\Modules\Remediation\Classes\Utils;
use EA11y\Modules\Remediation\Database\Page_Entry;
use Throwable;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Remediation_Runner
 */
class Remediation_Runner {
	public array $page_data = [];
	public Page_Entry $page;

	public function get_remediation_classes() : array {
		static $classes = null;
		if ( null === $classes ) {
			$classes = apply_filters( 'ea11y_remediations_classes', [
				'ATTRIBUTE' => 'Attribute',
				'ELEMENT'   => 'Element',
				'REPLACE' => 'Replace',
			] );
		}
		return $classes;
	}

	private function should_run_remediation(): bool {
		try {
			$current_url = Utils::get_current_page_url();
			$this->page = new Page_Entry([
				'by' => 'url',
				'value' => $current_url,
			]);
			$this->page_data = $this->page->get_page_data();
			if ( empty( $this->page_data['remediations'] ) ) {
				return false;
			}
			return true;
		} catch ( Throwable $t ) {
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
		if ( $this->page_data['html'] && $this->page->is_valid_hash() ) {
			return $this->page_data['html'];
		}
		$dom = $this->generate_remediation_dom( $buffer );
		if ( ! is_admin_bar_showing() ) {
			$this->page->update_html( $dom );
		}
		return $dom;
	}

	private function generate_remediation_dom( $buffer ): string {
		$dom = new DOMDocument();
		$dom->loadHTML( $buffer, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR );

		$classes = $this->get_remediation_classes();
		foreach ( $this->page_data['remediations'] as $remediation ) {
			if ( ! isset( $classes[ strtoupper( $remediation['type'] ) ] ) ) {
				continue;
			}
			$remediation_class_name = $this->get_remediation_class_name( $remediation['type'] );
			$remediation_class = new $remediation_class_name( $dom, $remediation );
			$dom = $remediation_class->dom;
		}

		return $dom->saveHTML();
	}

	public function __construct() {
		if ( is_admin() ) {
			return;
		}

		if ( $this->should_run_remediation() ) {
			add_action( 'template_redirect', [ $this, 'start' ] );
		}
	}
}
