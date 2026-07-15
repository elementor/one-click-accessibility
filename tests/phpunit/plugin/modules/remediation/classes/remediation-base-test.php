<?php
namespace EA11y\Tests\Modules\Remediation\Classes;

use DOMDocument;
use EA11y\Modules\Remediation\Classes\Remediation_Base;
use Eunit\Cases\Unit_Test;

/**
 * Class Remediation_Base_Test
 *
 * Covers the snippet-based fallback matching used when an XPath no longer
 * resolves to the intended element (e.g. dynamically rendered markup).
 */
class Remediation_Base_Test extends Unit_Test {

	private function make_dom( string $html ): DOMDocument {
		$dom = new DOMDocument( '1.0', 'UTF-8' );
		libxml_use_internal_errors( true );
		$dom->loadHTML( $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();

		return $dom;
	}

	/**
	 * A type/xpath that won't resolve to anything real; we only need an
	 * instance to exercise the public snippet-matching helpers directly.
	 */
	private function make_instance( DOMDocument $dom ): Remediation_Base {
		return new Remediation_Base( $dom, [
			'type' => 'test',
			'xpath' => '//does-not-exist',
		] );
	}

	public function test_get_element_by_snippet_uses_id_and_class_when_present() {
		$dom = $this->make_dom(
			'<div><span id="foo" class="a">first</span><span id="bar" class="a">second</span></div>'
		);
		$instance = $this->make_instance( $dom );

		$element = $instance->get_element_by_snippet( '<span id="bar" class="a">' );

		$this->assertNotNull( $element );
		$this->assertSame( 'bar', $element->getAttribute( 'id' ) );
	}

	public function test_get_element_by_snippet_without_id_or_class_picks_matching_candidate() {
		// Two <svg> elements with the same tag and no id/class (e.g. inline SVGs
		// rendered by an animation library) - only the snippet content can
		// disambiguate them.
		$dom = $this->make_dom(
			'<div>' .
			'<svg data-key="one"><path d="M0 0"></path></svg>' .
			'<svg data-key="two"><path d="M1 1"></path></svg>' .
			'</div>'
		);
		$instance = $this->make_instance( $dom );

		$element = $instance->get_element_by_snippet( '<svg data-key="two">' );

		$this->assertNotNull( $element );
		$this->assertSame( 'two', $element->getAttribute( 'data-key' ) );
	}

	public function test_get_element_by_snippet_without_id_or_class_falls_back_to_first_candidate() {
		// Neither candidate contains the snippet - previous best-effort
		// behavior of returning *some* same-tag element should be preserved
		// rather than returning nothing.
		$dom = $this->make_dom(
			'<div>' .
			'<svg data-key="one"></svg>' .
			'<svg data-key="two"></svg>' .
			'</div>'
		);
		$instance = $this->make_instance( $dom );

		$element = $instance->get_element_by_snippet( '<svg data-key="does-not-exist">' );

		$this->assertNotNull( $element );
		$this->assertSame( 'one', $element->getAttribute( 'data-key' ) );
	}

	public function test_find_best_matching_element_by_tag_returns_null_when_tag_missing() {
		$dom = $this->make_dom( '<div><span>hello</span></div>' );
		$instance = $this->make_instance( $dom );

		$element = $instance->find_best_matching_element_by_tag( 'svg', '<svg></svg>' );

		$this->assertNull( $element );
	}
}
