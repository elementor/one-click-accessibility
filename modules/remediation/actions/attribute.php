<?php

namespace EA11y\Modules\Remediation\Actions;

use EA11y\Modules\Remediation\Components\Remediation_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Attribute
 */
class Attribute extends Remediation_Base {

	public static string $type = 'attribute';

	public function run() : \DOMDocument {
		foreach ( $this->data as $element ) {
			$element_node = $this->get_element_by_xpath( $element['xpath'] );
			if ( ! $element_node ) {
				continue;
			}
			switch ( $element['action'] ) {
				case 'update':
				case 'add':
					$element_node->setAttribute( $element['attribute_name'], $element['attribute_value'] );
					break;
				case 'remove':
					$element_node->removeAttribute( $element['attribute_name'] );
					break;
				case 'clear':
					$element_node->setAttribute( $element['attribute_name'], '' );
					break;
			}
		}
		return $this->dom;
	}
}
