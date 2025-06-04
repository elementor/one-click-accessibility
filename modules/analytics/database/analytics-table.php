<?php

namespace EA11y\Modules\Analytics\Database;

use EA11y\Classes\Database\Database_Constants;
use EA11y\Classes\Database\Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Analytics_Table extends Table {
	// override base's const:
	const DB_VERSION = '1';
	const DB_VERSION_FLAG_NAME = 'ea11y_analytics_db_version';

	const ID = 'id';
	const EVENT = 'event';
	const VALUE = 'value';
	const CREATED_AT = 'created_at';

	const EVENTS = [
		'bigger-text',
		'bigger-line-height',
		'text-align',
		'readable-font',
		'grayscale',
		'contrast',
		'page-structure',
		'sitemap',
		'reading-mask',
		'hide-images',
		'pause-animations',
		'highlight-links',
		'focus-outline',
		'screen-reader',
		'widget-open',
		'hide-widget',
		'statement',
		'language-selector',
	];

	public static $table_name = 'ea11y_analytics';

	public static function get_columns(): array {
		return [
			self::ID => [
				'type'  => Database_Constants::get_col_type( Database_Constants::INT, 11 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::UNSIGNED,
					Database_Constants::NOT_NULL,
					Database_Constants::AUTO_INCREMENT,
				] ),
				'key'   => Database_Constants::get_primary_key_string( self::ID ),
			],
			self::EVENT => [
				'type'  => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
					Database_Constants::COMMENT,
					'"' . implode( '|', self::EVENTS ) . '"',
				] ),
			],
			self::VALUE => [
				'type'  => Database_Constants::get_col_type( Database_Constants::VARCHAR, 255 ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::DEFAULT,
					'\'\'',
				] ),
			],
			self::CREATED_AT => [
				'type'  => Database_Constants::get_col_type( Database_Constants::DATETIME ),
				'flags' => Database_Constants::build_flags_string( [
					Database_Constants::NOT_NULL,
					Database_Constants::DEFAULT,
					Database_Constants::CURRENT_TIMESTAMP,
				] ),
			],
		];
	}
}
