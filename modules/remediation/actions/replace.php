<?php

namespace EA11y\Modules\Remediation\Actions;

use EA11y\Modules\Remediation\Components\Remedation_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Replace
 */
class Replace extends Remedation_Base {

	public static string $type = 'replace';

	public function run() : \DOMDocument {
        $html_as_string = $this->dom->savesaveHTML();
		foreach ( $this->data as $element ) {
            $html_as_string = str_replace( $element['find'], $element['replace'], $html_as_string );
		}
        $this->dom = new \DOMDocument();
		$this->dom->loadHTML( $html_as_string, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		return $this->dom;
	}
}
