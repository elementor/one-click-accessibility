<?php

namespace EA11y\Modules\Remediation\Classes;

use DOMDocument;
use DOMElement;
use DOMXPath;

class Remediation_Base {
	public static string $type = 'remediation';

	public DOMDocument $dom;
	/**
	 * Use frontend remediation flag
	 *
	 * @var boolean
	 */
	public bool $use_frontend = false;
	/**
	 * @var mixed
	 */
	public array $data;

	public function get_type(): string {
		return static::$type;
	}

	/**
	 * Check if the element exists
	 *
	 * @return boolean
	 */
	public function exists(): bool {
		return $this->get_element_by_xpath( $this->data['xpath'] ) instanceof DOMElement;
	}

	/**
	 * get_element_by_xpath
	 * @param $xpath
	 *
	 * @return \DOMElement|\DOMNameSpaceNode|\DOMNode|null
	 */
	public function get_element_by_xpath( $query ) {
		$xpath = new DOMXPath( $this->dom );
		$elements = $xpath->query( $query );

		if ( $elements->length > 0 ) {
			return $elements->item( 0 );
		}

		return null;
	}

	/**
	 * Get an element by XPath and verify it contains the given snippet.
	 * If not, fall back to searching by the snippet itself.
	 *
	 * @param string|null      $xpath
	 * @param string|null      $snippet
	 * @return DOMElement|null
	 */
	public function get_element_by_xpath_with_snippet_fallback( ?string $xpath, ?string $snippet ): ?DOMElement {
		if ( ! $xpath ) {
			return null;
		}

		$element  = $this->get_element_by_xpath( $xpath );
		if ( $element && ! $this->element_contains_snippet( $element, $snippet ) ) {
			// XPath result doesn't contain the snippet
			$element = null;
		}

		// Fallback to snippet-based search
		if ( ! $element ) {
			$element = $this->get_element_by_snippet( $snippet );
		}

		return $element;
	}

	/**
	 * Check if a DOMElement contains a given snippet of HTML.
	 *
	 * @param DOMElement $element
	 * @param string     $snippet
	 * @return bool
	 */
	public function element_contains_snippet( DOMElement $element, string $snippet ): bool {
		$outer_html = $this->dom->saveHTML( $element );

		return stripos( $outer_html, $snippet ) !== false;
	}

	/**
	 * Find an element in a DOMDocument by matching its tag, ID, and/or class from a snippet.
	 *
	 * @param string      $snippet
	 * @return DOMElement|null
	 */
	public function get_element_by_snippet( string $snippet ): ?DOMElement {
		$temp = new DOMDocument();
		libxml_use_internal_errors( true );
		$temp->loadHTML( $snippet, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();

		$parsed = $temp->documentElement;
		if ( ! $parsed ) {
			return null;
		}

		$tag   = strtolower( $parsed->tagName );
		$id    = $parsed->getAttribute( 'id' );
		$class = trim( $parsed->getAttribute( 'class' ) );

		$query      = '//' . $tag;
		$conditions = [];

		if ( $id ) {
			$conditions[] = "@id='{$id}'";
		}

		if ( $class ) {
			$classes = preg_split( '/\s+/', $class );
			foreach ( $classes as $c ) {
				$conditions[] = sprintf(
					"contains(concat(' ', normalize-space(@class), ' '), ' %s ')",
					$c
				);
			}
		}

		if ( $conditions ) {
			$query .= '[' . implode( ' and ', $conditions ) . ']';
		}

		return $this->get_element_by_xpath( $query );
	}


	public function run() : ?DOMDocument {
		return $this->dom;
	}

	/**
	 * @throws \DOMException
	 */
	public function create_element( $data ) : DomElement {
		$element = $this->dom->createElement( $data['tag'] );
		if ( isset( $data['attributes'] ) ) {
			foreach ( $data['attributes'] as $attribute ) {
				$element->setAttribute( $attribute['name'], $attribute['value'] );
			}
		}
		if ( isset( $data['content'] ) ) {
			// @phpcs:ignore
			$element->nodeValue = $data['content'];
		}
		return $element;
	}

	public function __construct( DOMDocument $dom, $data ) {
		$this->dom = $dom;
		$this->data = $data;
		// if it's not global and not styles and element does not exist, move the remediation to the Frontend
		if ( 'STYLES' !== $this->data['type'] && ! $this->data['global'] && ! $this->exists() ) {
			$this->use_frontend = true;
			return;
		}
		$this->run();
	}
}
