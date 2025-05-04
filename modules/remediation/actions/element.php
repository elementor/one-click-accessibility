<?php

namespace EA11y\Modules\Remediation\Actions;

use EA11y\Modules\Remediation\Components\Remediation_Base;

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
	public function run() : \DOMDocument {
		foreach ( $this->data as $element ) {
			$element_node = null;
			$child = null;
			if ( ! $element_node ) {
				continue;
			}

			if ( isset( $element['xpath'] ) ) {
				$element_node = $this->get_element_by_xpath( $element['xpath'] );
			}

			if ( isset( $element['child'] ) ) {
				try {
					$child = $this->create_element( $element['child'] );
				} catch ( \DOMException $e ) {
					continue;
				}
			}
			// @codingStandardsIgnoreStart
			switch ( $element['action'] ) {
				case 'add':
					$this->dom->append( $element['attribute_name'], $element['attribute_value'] );
					break;
				case 'update':
					$element_node->nodeValue = $element['content'];
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
		}
		return $this->dom;
	}
}
