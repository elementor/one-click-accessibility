<?php

namespace EA11y\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Plugin_Activation
 *
 * Handles activation / deactivation lifecycle work that must run before
 * `plugins_loaded` (and therefore before the EA11y spl autoloader registered
 * in Plugin::__construct is available).
 */
final class Plugin_Activation {
	private string $file;

	public function __construct( string $file ) {
		$this->file = $file;

		register_activation_hook( $this->file, [ $this, 'on_activate' ] );
		register_deactivation_hook( $this->file, [ $this, 'on_deactivate' ] );
	}

	public function on_activate(): void {
		$this->run_silently( [ $this, 'clear_ally_cache' ] );
	}

	public function on_deactivate(): void {
		$this->run_silently( [ $this, 'clear_ally_cache' ] );
	}

	/**
	 * Clear the entire Ally page-HTML cache.
	 *
	 * Short-circuits when the custom table does not yet exist (first activation),
	 * and swallows any unexpected throwable so activation never aborts on a
	 * cache-clear failure.
	 */
	private function clear_ally_cache(): void {
		$this->require_cache_dependencies();

		if ( ! $this->ally_cache_table_exists() ) {
			return;
		}

		try {
			\EA11y\Modules\Remediation\Database\Page_Entry::clear_all_cache();
		} catch ( \Throwable $e ) {
			unset( $e ); // intentional no-op; activation must never abort on cache-clear failure.
		}
	}

	private function ally_cache_table_exists(): bool {
		global $wpdb;

		$table = \EA11y\Modules\Remediation\Database\Page_Table::table_name();

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		return (bool) $wpdb->get_var(
			$wpdb->prepare( 'SHOW TABLES LIKE %s', $table )
		);
	}

	/**
	 * Run the callback with $wpdb error printing suppressed and any stray
	 * output buffered and discarded. Prevents WP's "plugin generated N
	 * characters of unexpected output during activation" warning.
	 */
	private function run_silently( callable $callback ): void {
		global $wpdb;

		$previous_show = isset( $wpdb ) ? $wpdb->show_errors : null;
		if ( isset( $wpdb ) ) {
			$wpdb->hide_errors();
		}

		ob_start();
		try {
			$callback();
		} catch ( \Throwable $e ) {
			unset( $e ); // intentional no-op; activation must never abort.
		} finally {
			ob_end_clean();
			if ( isset( $wpdb ) && $previous_show ) {
				$wpdb->show_errors();
			}
		}
	}

	private function require_cache_dependencies(): void {
		require_once EA11Y_PATH . 'classes/database/exceptions/missing-table-exception.php';
		require_once EA11Y_PATH . 'classes/database/database-constants.php';
		require_once EA11Y_PATH . 'classes/database/table.php';
		require_once EA11Y_PATH . 'classes/database/entry.php';
		require_once EA11Y_PATH . 'modules/remediation/database/page-table.php';
		require_once EA11Y_PATH . 'modules/remediation/exceptions/missing-url.php';
		require_once EA11Y_PATH . 'modules/remediation/classes/utils.php';
		require_once EA11Y_PATH . 'modules/remediation/database/page-entry.php';
	}
}
