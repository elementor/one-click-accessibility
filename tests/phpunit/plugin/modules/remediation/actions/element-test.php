<?php
namespace EA11y\Tests\Modules\Remediation\Actions;

use DOMDocument;
use DOMXPath;
use EA11y\Modules\Remediation\Actions\Element;
use Eunit\Cases\Unit_Test;

/**
 * Class Element_Test
 *
 * Covers Element::run() falling back to snippet-based matching (and
 * deferring to the frontend) the same way Attribute/Replace already do.
 */
class Element_Test extends Unit_Test {

	private function make_dom( string $html ): DOMDocument {
		$dom = new DOMDocument( '1.0', 'UTF-8' );
		libxml_use_internal_errors( true );
		$dom->loadHTML( $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();

		return $dom;
	}

	public function test_run_applies_action_when_xpath_matches_directly() {
		$dom = $this->make_dom( '<div><span id="target">hello</span></div>' );

		$element = new Element( $dom, [
			'type' => 'element',
			'xpath' => "//*[@id='target']",
			'action' => 'remove',
		] );

		$this->assertFalse( $element->use_frontend );

		$xpath = new DOMXPath( $dom );
		$this->assertSame( 0, $xpath->query( "//*[@id='target']" )->length );
	}

	public function test_run_falls_back_to_snippet_when_xpath_is_stale() {
		// The xpath no longer resolves to the intended element (e.g. the page
		// structure shifted), but the snippet still uniquely identifies it.
		$dom = $this->make_dom(
			'<div><span id="target" class="icon">hello</span></div>'
		);

		$element = new Element( $dom, [
			'type' => 'element',
			'xpath' => "//*[@id='does-not-exist']",
			'find' => '<span id="target" class="icon">',
			'action' => 'remove',
		] );

		$this->assertFalse( $element->use_frontend );

		$xpath = new DOMXPath( $dom );
		$this->assertSame( 0, $xpath->query( "//*[@id='target']" )->length );
	}

	public function test_run_falls_back_to_snippet_without_id_or_class_for_dynamic_elements() {
		// Two same-tag elements without id/class (e.g. dynamically rendered
		// SVG icons) - only the snippet content can disambiguate them.
		$dom = $this->make_dom(
			'<div>' .
			'<svg data-key="one"><path d="M0 0"></path></svg>' .
			'<svg data-key="two"><path d="M1 1"></path></svg>' .
			'</div>'
		);

		$element = new Element( $dom, [
			'type' => 'element',
			'xpath' => "//*[@id='does-not-exist']",
			'find' => '<svg data-key="two">',
			'action' => 'remove',
		] );

		$this->assertFalse( $element->use_frontend );

		$remaining = $dom->getElementsByTagName( 'svg' );
		$this->assertSame( 1, $remaining->length );
		$this->assertSame( 'one', $remaining->item( 0 )->getAttribute( 'data-key' ) );
	}

	public function test_run_defers_to_frontend_when_element_cannot_be_found() {
		$dom = $this->make_dom( '<div><span id="other">hello</span></div>' );

		$element = new Element( $dom, [
			'type' => 'element',
			'xpath' => "//*[@id='does-not-exist']",
			'find' => '<span id="also-missing" class="icon">',
			'action' => 'remove',
		] );

		$this->assertTrue( $element->use_frontend );
	}
}
