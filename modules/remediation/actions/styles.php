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
class Styles extends Remediation_Base {
	public static string $type = 'styles';

	public function __construct( DOMDocument $dom, $data ) {
		parent::__construct( $dom, $data );

		$this->use_frontend = true;
	}

	public function run() : ?DOMDocument {
		return $this->dom;
	}
}
