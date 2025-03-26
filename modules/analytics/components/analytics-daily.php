<?php

namespace EA11y\Modules\Analytics\Components;

use EA11y\Modules\Analytics\Database\Analytics_Entry;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Analytics_Daily
 *
 * Analytics daily cron jobs
 */
class Analytics_Daily {

	const JOB_DAILY_HOOK = 'daily_remove_analytics';

	/**
	 * Init daily jobs
	 */
	public function __construct() {
		// Hook into WordPress to schedule the event when the plugin is activated
		add_action( 'wp', [ static::class, 'register_daily_job' ] );
		// Hook the scheduled event to our custom function
		add_action( self::JOB_DAILY_HOOK, [ static::class, 'remove_expired_analytics' ] );

		// Hook into plugin deactivation  to clear the scheduled event
		register_deactivation_hook( __FILE__, [ static::class, 'clear_remove_expired_daily_event' ] );
	}

	/**
	 * Job for remove expired logs
	 * @return void
	 */
	public static function remove_expired_analytics() {
		Analytics_Entry::delete_expired_entries();
	}

	/**
	 * Register hook for daily job if no exist
	 */
	public static function register_daily_job() {
		if ( ! wp_next_scheduled( self::JOB_DAILY_HOOK ) ) {
			wp_schedule_event( strtotime( 'tomorrow midnight' ), 'daily', self::JOB_DAILY_HOOK );
		}
	}

	/**
	 * Clear the scheduled event upon deactivation
	 */
	public static function clear_remove_expired_daily_event() {
		$timestamp = wp_next_scheduled( self::JOB_DAILY_HOOK );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::JOB_DAILY_HOOK );
		}
	}
}
