<?php

namespace EA11y\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Logger {
	public const LEVEL_ERROR = 'error';
	public const LEVEL_WARN = 'warn';
	public const LEVEL_INFO = 'info';

	private static function log( string $log_level, $message ): void {
		$backtrace = debug_backtrace(); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_debug_backtrace

		$class    = $backtrace[2]['class'] ?? null;
		$type     = $backtrace[2]['type'] ?? null;
		$function = $backtrace[2]['function'];

		if ( $class ) {
			$message = '[EA11Y]: ' . $log_level . ' in ' . "$class$type$function()" . ': ' . $message;
		} else {
			$message = '[EA11Y]: ' . $log_level . ' in ' . "$function()" . ': ' . $message;
		}

		error_log( $message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}

	public static function error( $message ): void {
		self::log( self::LEVEL_ERROR, $message );
	}

	public static function info( $message ): void {
		self::log( self::LEVEL_INFO, $message );
	}
}
