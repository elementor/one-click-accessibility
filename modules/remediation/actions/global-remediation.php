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
class Global_Remediation extends Remediation_Base {

	public static string $type = 'replace';

	public function run() : ?DOMDocument {
		$html = $this->dom->saveHTML();
		if ( stripos( $html, $this->data['find'] ) === false ) {
			$this->use_frontend = true;
			return null;
		}

		$updated_html = str_ireplace( $this->data['find'], $this->data['replace'], $html );

		$tmp_dom = new DOMDocument( '1.0', 'UTF-8' );
		$tmp_dom->loadHTML(
			htmlentities( $updated_html, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ),
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING
		);

		return $this->dom;
	}

}
