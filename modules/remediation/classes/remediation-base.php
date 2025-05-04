<?php

namespace EA11y\Modules\Remediation\Components;

use DOMDocument;
use DOMElement;
use DOMXPath;

class Remediation_Base {
	public static string $type = 'remediation';

	public DOMDocument $dom;
	/**
	 * @var mixed
	 */
	public array $data;

	public function get_type(): string {
		return static::$type;
	}

	/**
	 * get_element_by_xpath
	 * @param $xpath
	 *
	 * @return \DOMElement|\DOMNameSpaceNode|\DOMNode|null
	 */
	public function get_element_by_xpath( $xpath ) {
		$xpath = new DOMXPath( $this->dom );
		$elements = $xpath->query( $xpath );

		if ( $elements->length > 0 ) {
			return $elements->item( 0 );
		}

		return null;
	}

	public function run() : DOMDocument {
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
		return $this->run();
	}
}
