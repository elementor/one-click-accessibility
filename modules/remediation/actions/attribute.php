<?php

namespace EA11y\Modules\Remediation\Actions;

use EA11y\Modules\Remediation\Classes\Remediation_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Attribute
 */
class Attribute extends Remediation_Base {

	public static string $type = 'attribute';

	public function run() : \DOMDocument {
		$element_node = $this->get_element_by_xpath( $this->data['xpath'] );
		if ( ! $element_node ) {
			return $this->dom;
		}
		switch ( $this->data['action'] ) {
			case 'update':
			case 'add':
				$element_node->setAttribute( $this->data['attribute_name'], $this->data['attribute_value'] );
				break;
			case 'remove':
				$element_node->removeAttribute( $this->data['attribute_name'] );
				break;
			case 'clear':
				$element_node->setAttribute( $this->data['attribute_name'], '' );
				break;
		}

		return $this->dom;
	}
}
