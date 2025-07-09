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
		// if element does not exist, move the remediation to the Frontend
		if ( ! $this->exists() ) {
			$this->use_frontend = true;
			return;
		}
		$this->run();
	}
}
