<?php
/**
 * wp_ajax_print_handler
* @param $message
 */
function wp_ajax_print_handler( $message ): void {
	echo esc_html( $message );
}
