<?php

namespace EA11y\Modules\Remediation\Classes;

use EA11y\Classes\Database\Exceptions\Missing_Table_Exception;
use EA11y\Classes\Rest\Route;
use EA11y\Modules\Remediation\Database\Page_Entry;
use EA11y\Modules\Remediation\Database\Page_Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Route_Base
 */
class Route_Base extends Route {
	protected bool $override = false;
	protected $auth = true;
	protected string $path = '';
	public function get_methods(): array {
		return [];
	}

	public function get_endpoint(): string {
		return 'remediation/' . $this->get_path();
	}

	public function get_path(): string {
		return $this->path;
	}

	public function get_name(): string {
		return '';
	}

	public function get_permission_callback( \WP_REST_Request $request ) : bool {
		$valid = $this->permission_callback( $request );

		return $valid && user_can( $this->current_user_id, 'manage_options' );
	}

	/**
	 * @throws Missing_Table_Exception
	 */
	public function get_page_entry( $url ) {
		$page_entry = new Page_Entry( [
			'by' => Page_Table::URL,
			'value' => $url,
		] );
		if ( ! $page_entry->exists() ) {
			return false;
		}
		return $page_entry;
	}

	/**
	 * @throws Missing_Table_Exception
	 */
	public function clear_cache( string $url ) : void {
		$page = $this->get_page_entry( $url );
		if ( ! $page ) {
			throw new Missing_Table_Exception( 'Page entry not found' );
		}

		$page->__set( Page_Table::FULL_HTML, null );
		$page->save();
	}
}
