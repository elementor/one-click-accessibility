<?php

namespace EA11y\Modules\Remediation\Actions;

use DOMDocument;
use EA11y\Modules\Remediation\Classes\Remediation_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Replace
 */
class Replace extends Remediation_Base {

	public static string $type = 'replace';

	public function run() : ?DOMDocument {
		$element_node = $this->get_element_by_xpath( $this->data['xpath'] );
		if ( ! $element_node instanceof \DOMElement ) {
			return null;                    // nothing to do
		}

		$outer_html = $this->dom->saveHTML( $element_node );

		if ( strpos( $outer_html, $this->data['find'] ) === false ) {
			return $this->dom;
		}

		$updated_html = str_replace( $this->data['find'], $this->data['replace'], $outer_html );

		if ( $updated_html === $outer_html ) {
			return $this->dom;
		}

		$tmp_dom = new DOMDocument('1.0', 'UTF-8');
		$tmp_dom->loadHTML(
			mb_convert_encoding($updated_html, 'HTML-ENTITIES', 'UTF-8'),
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING
		);

		$new_node = $this->dom->importNode( $tmp_dom->documentElement, true );
		$element_node->parentNode->replaceChild( $new_node, $element_node );

		return $this->dom;
	}

}
