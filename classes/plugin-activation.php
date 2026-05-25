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
		$this->clear_ally_cache();
	}

	public function on_deactivate(): void {
		$this->clear_ally_cache();
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
		try {
			\EA11y\Modules\Remediation\Database\Page_Entry::clear_all_cache();
		} catch ( \Throwable $e ) {
			unset( $e ); // intentional no-op; activation must never abort on cache-clear failure.
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
