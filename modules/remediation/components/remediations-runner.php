<?php

namespace EA11y\Modules\Remediation\Components;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Remediations_Runner
 */
class Remediations_Runner {
	public $remediations = [];

	public function get_remediation_classes() : array {
		static $classes = null;
		if ( null === $classes ) {
			$classes = apply_filters( 'ea11y_remediations_classes', [
				'ATTRIBUTE' => 'Attribute',
				'ELEMENT'   => 'Element',
			] );
		}
		return $classes;
	}

	private function should_run_remediation(): bool {
		// @todo: Add logic to determine if remediation should run
		// and load them from DB
		$this->remediations = apply_filters( 'ea11y_remediations', $this->remediations );
		return true;
	}

	private function start() {
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

	private function run_remediations( $buffer ) {
		$dom = new \DOMDocument();
		$dom->loadHTML( $buffer, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		$classes = $this->get_remediation_classes();
		foreach ( $this->remediations as $remediation ) {
			if ( ! isset( $classes[ strtoupper( $remediation['type'] ) ] ) ) {
				continue;
			}
			$remediation_class_name = $this->get_remediation_class_name( $remediation['type'] );
			$dom = new $remediation_class_name( $dom, $remediation );
		}
		// @todo: Add logic to save the remediated content
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
