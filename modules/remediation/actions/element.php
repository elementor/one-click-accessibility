<?php

namespace EA11y\Modules\Remediation\Actions;

use DOMDocument;
use EA11y\Modules\Remediation\Classes\Remediation_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Attribute
 */
class Element extends Remediation_Base {

	public static string $type = 'element';

	/**
	 * Run the action
	 */
	public function run() : ?DOMDocument {

		$element_node = null;
		$child = null;

		if ( isset( $this->data['xpath'] ) ) {
			$element_node = $this->get_element_by_xpath( $this->data['xpath'] );
		}

		if ( ! $element_node ) {
			return null;
		}

		if ( isset( $this->data['child'] ) ) {
			try {
				$child = $this->create_element( $this->data['child'] );
			} catch ( \DOMException $e ) {
				return $this->dom;
			}
		}
		// @codingStandardsIgnoreStart
		switch ( $this->data['action'] ) {
			case 'add':
				$this->dom->append( $this->data['attribute_name'], $this->data['attribute_value'] );
				break;
			case 'update':
				$element_node->nodeValue = $this->data['content'];
				break;
			case 'remove':
				$element_node->parentNode->removeChild( $element_node );
				break;
			case 'add_child':
				$element_node->appendChild( $child );
				break;
			case 'remove_child':
				$element_node->removeChild( $child );
				break;
			case 'add_before':
				$element_node->parentNode->insertBefore( $child, $element_node );
				break;
			case 'add_after':
				$element_node->parentNode->insertBefore( $child, $element_node->nextSibling );
				break;
		}
		// @codingStandardsIgnoreEnd
		return $this->dom;
	}
}
