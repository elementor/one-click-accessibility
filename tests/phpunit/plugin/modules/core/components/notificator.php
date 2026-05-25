<?php

namespace EA11y\Tests\Modules\Core\Components;

use EA11y\Modules\Core\Components\Notificator as Tested_Component;
use Eunit\Cases\Unit_Test;

class Notificator extends Unit_Test {

	private ?Tested_Component $notificator = null;

	public function setUp(): void {
		parent::setUp();

		delete_option( '_ally_notifications' );

		add_filter( 'pre_http_request', [ $this, 'mock_http_request' ], 10, 3 );
	}

	public function tearDown(): void {
		parent::tearDown();

		remove_filter( 'pre_http_request', [ $this, 'mock_http_request' ] );

		delete_option( '_ally_notifications' );

		$this->notificator = null;
	}

	public function mock_http_request( $preempt, $args, $url ) {
		if ( strpos( $url, 'my.elementor.com/api/v1/notifications' ) === false ) {
			return $preempt;
		}

		return [
			'response' => [
				'code'    => 200,
				'message' => 'OK',
			],
			'body'     => wp_json_encode( [
				'notifications' => [
					[
						'id'          => 'test-notification-1',
						'title'       => 'Test Notification',
						'description' => 'This is a test notification',
						'link'        => 'https://example.com',
					],
				],
			] ),
		];
	}

	public function test_notificator_can_be_instantiated(): void {
		$this->notificator = new Tested_Component();

		$this->assertInstanceOf( Tested_Component::class, $this->notificator );
	}

	public function test_notificator_returns_notifications(): void {
		$this->notificator = new Tested_Component();

		$notifications = $this->notificator->get_notifications_by_conditions( true );

		$this->assertIsArray( $notifications );
	}

	public function test_notificator_caches_notifications(): void {
		$this->notificator = new Tested_Component();

		$this->notificator->get_notifications_by_conditions( true );

		$cached = get_option( '_ally_notifications' );

		$this->assertNotEmpty( $cached );
		$this->assertArrayHasKey( 'timeout', $cached );
		$this->assertArrayHasKey( 'value', $cached );
	}
}
