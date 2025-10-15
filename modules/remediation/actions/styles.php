<?php

namespace EA11y\Modules\Remediation\Actions;

use DOMDocument;
use DOMElement;
use EA11y\Modules\Remediation\Classes\Remediation_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Replace
 */
class Styles extends Remediation_Base {
	public static string $type = 'styles';
	public static string $style_id = 'ea11y-remediation-styles';


	/**
	 * Build a CSS selector string for a given DOMElement.
	 *
	 * @param DOMElement $element
	 * @return string|null
	 */
	public function get_element_css_selector( DOMElement $element ): ?string {

		$parts = [];

		while ( $element && XML_ELEMENT_NODE === $element->nodeType ) {
			$selector = strtolower( $element->tagName );

			// If element has ID, stop here
			if ( $element->hasAttribute( 'id' ) ) {
				$selector .= '#' . $element->getAttribute( 'id' );
				array_unshift( $parts, $selector );
				break;
			}

			// Add classes unless body
			if ( $element->hasAttribute( 'class' ) && strtolower( $element->tagName ) !== 'body' ) {
				$classes = preg_split( '/\s+/', trim( $element->getAttribute( 'class' ) ) );
				if ( ! empty( $classes ) ) {
					$selector .= '.' . implode( '.', $classes );
				}
			}

			// Add nth-of-type if needed
			$parent = $element->parentNode;
			if ( $parent instanceof DOMElement ) {
				$tag_name = $element->tagName;
				$siblings = [];
				foreach ( $parent->childNodes as $child ) {
					if ( $child instanceof DOMElement && $child->tagName === $tag_name ) {
						$siblings[] = $child;
					}
				}

				if ( count( $siblings ) > 1 ) {
					foreach ( $siblings as $i => $sibling ) {
						if ( $sibling->isSameNode( $element ) ) {
							$selector .= ':nth-of-type(' . ( $i + 1 ) . ')';
							break;
						}
					}
				}
			}

			array_unshift( $parts, $selector );
			$element = $element->parentNode instanceof DOMElement ? $element->parentNode : null;
		}

		return implode( ' > ', $parts );
	}

	/**
	 * Replace CSS selectors for color and background-color rules.
	 *
	 * @param string $css The original CSS string
	 * @param string|null $color_selector New selector for color rule
	 * @param string|null $bg_selector New selector for background-color rule
	 * @return string The modified CSS
	 */
	public function replace_css_selectors( string $css, ?string $color_selector = null, ?string $bg_selector = null ): string {
		// Replace color selector
		if ( $color_selector ) {
			$css = preg_replace_callback(
				'/(?<!-)\bcolor\s*:\s*([#a-zA-Z0-9(),.\s%-]+)\s*!?important?;/i',
				function( $matches ) use ( $color_selector ) {
					$color_value = trim( $matches[1] );
					return $color_selector . " { color: {$color_value} !important; }";
				},
				$css
			);
		}

		// Replace background-color selector
		if ( $bg_selector ) {
			$css = preg_replace_callback(
				'/background-color\s*:\s*([#a-zA-Z0-9(),.\s%-]+)\s*!?important?;/i',
				function( $matches ) use ( $bg_selector ) {
					$bg_value = trim( $matches[1] );
					return $bg_selector . " { background-color: {$bg_value} !important; }";
				},
				$css
			);
		}

		return $css;
	}



	public function run() : ?DOMDocument {
		$rule = $this->data['rule'];
		if ( $this->data['global'] ) {
			$el_color = $this->get_element_by_xpath_with_snippet_fallback( $this->data['xpath'], $this->data['find'] );
			$el_bg = $this->get_element_by_xpath_with_snippet_fallback( $this->data['parentXPath'], $this->data['parentFind'] );
			$color_css_selector = $this->get_element_css_selector( $el_color );
			$bg_css_selector = $this->get_element_css_selector( $el_bg );

			if ( ! $color_css_selector && ! $bg_css_selector ) {
				$this->use_frontend = true;
				return null;
			}

			$rule = $this->replace_css_selectors( $rule, $color_css_selector, $bg_css_selector );
		}

		// Find or create <head> element
		$head = $this->dom->getElementsByTagName( 'head' )->item( 0 );
		if ( ! $head ) {
			$head = $this->dom->createElement( 'head' );
			$html_element = $this->dom->getElementsByTagName( 'html' )->item( 0 );
			if ( $html_element ) {
				$html_element->insertBefore( $head, $this->dom->getElementsByTagName( 'body' )->item( 0 ) );
			} else {
				$this->dom->appendChild( $head );
			}
		}

		// Create <style> tag
		$style = $this->dom->getElementById( self::$style_id );
		if ( ! $style ) {
			$style = $this->dom->createElement( 'style' );
		}
		$style->setAttribute( 'id', self::$style_id );
		$style->appendChild( $this->dom->createTextNode( $rule ) );

		// Append to the end of <head>
		$head->appendChild( $style );

		return $this->dom;
	}
}
