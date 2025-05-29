<?php

namespace EA11y\Modules\Remediation\Components;

use DOMDocument;
use EA11y\Classes\Logger;
use EA11y\Modules\Remediation\Classes\Utils;
use EA11y\Modules\Remediation\Database\Page_Entry;
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

			$this->page_html = $this->page->get_page_html();
			$this->page_remediations = Remediation_Entry::get_page_remediations( $current_url );
			if ( empty( $this->page_remediations ) ) {
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
		if ( ! is_user_logged_in() && $this->page_html && $this->page->is_valid_hash() ) {
			return $this->page_html;
		}
		$dom = $this->generate_remediation_dom( $buffer );
		if ( ! is_user_logged_in() ) {
			$this->page->update_html( $dom );
		}
		return $dom;
	}

	private function generate_remediation_dom( $buffer ): string {
		$dom = new DOMDocument();
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
			if ( ! isset( $classes[ strtoupper( $remediation['type'] ) ] ) ) {
				continue;
			}
			$remediation_class_name = $this->get_remediation_class_name( $remediation['type'] );
			$remediation_class = new $remediation_class_name( $dom, $remediation );
			if ( $remediation_class->dom ) {
				$remediation_class->dom = $dom;
			} else {
				Remediation_Entry::remove( $item->id );
			}
		}

		if ( isset( $removed_admin_bar, $parent ) ) {
			isset( $next_sibling ) && $next_sibling
				? $parent->insertBefore( $removed_admin_bar, $next_sibling )
				: $parent->appendChild( $removed_admin_bar );
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
