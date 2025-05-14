<?php

namespace EA11y\Classes\Rest;

use ReflectionClass;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_User;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

abstract class Route {

	/**
	 * Should the endpoint be validated for user authentication?
	 * If set to TRUE, the default permission callback will make sure the user is logged in and has a valid user id
	 * @var bool
	 */
	protected $auth = true;

	/**
	 * holds current authenticated user id
	 * @var int
	 */
	protected $current_user_id;

	/**
	 * Rest Endpoint namespace
	 * @var string
	 */
	protected $namespace = 'ea11y/v1';

	/**
	 * Should the endpoint override an existing one?
	 * @var bool
	 */
	protected bool $override = false;

	/**
	 * @var array The valid HTTP methods. The list represents the general REST methods. Do not modify.
	 */
	private $valid_http_methods = [
		'GET',
		'PATCH',
		'POST',
		'PUT',
		'DELETE',
	];

	/**
	 * Route_Base constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
	}

	/**
	 * rest_api_init
	 *
	 * Registers REST endpoints.
	 * Loops through the REST methods for this route, creates an endpoint configuration for
	 * each of them and registers all the endpoints with the WordPress system.
	 */
	public function rest_api_init(): void {
		$methods = $this->get_methods();
		if ( empty( $methods ) ) {
			return;
		}

		$callbacks = [];
		foreach ( (array) $methods as $method ) {
			if ( ! in_array( $method, $this->valid_http_methods, true ) ) {
				continue;
			}
			$callbacks[] = $this->build_endpoint_method_config( $method );
		}

		$arguments = $this->get_arguments();

		if ( ! $callbacks && empty( $arguments ) ) {
			return;
		}

		$arguments = array_merge( $arguments, (array) $callbacks );
		register_rest_route( $this->namespace, '/' . $this->get_endpoint() . '/', $arguments, $this->override );
	}

	/**
	 * get_methods
	 * Rest Endpoint methods
	 *
	 * Returns an array of the supported REST methods for this route
	 * @return array<string> REST methods being configured for this route.
	 */
	abstract public function get_methods(): array;

	/**
	 * get_callback
	 *
	 * Returns a reference to the callback function to handle the REST method specified by the /method/ parameter.
	 * @param string $method The REST method name
	 *
	 * @return callable A reference to a member function with the same name as the REST method being passed as a parameter,
	 * or a reference to the default function /callback/.
	 */
	public function get_callback_method( string $method ): callable {
		$method_name = strtolower( $method );
		$callback = $this->method_exists_in_current_class( $method_name ) ? $method_name : 'callback';
		return [ $this, $callback ];
	}

	/**
	 * get_permission_callback_method
	 *
	 * Returns a reference to the permission callback for the method if exists or the default one if it doesn't.
	 * @param string $method The REST method name
	 *
	 * @return callable If a method called (rest-method)_permission_callback exists, returns a reference to it, otherwise
	 * returns a reference to the default member method /permission_callback/.
	 */
	public function get_permission_callback_method( string $method ): callable {
		$method_name = strtolower( $method );
		$permission_callback_method = $method_name . '_permission_callback';
		$permission_callback = $this->method_exists_in_current_class( $permission_callback_method ) ? $permission_callback_method : 'permission_callback';
		return [ $this, $permission_callback ];
	}

	/**
	 * maybe_add_args_to_config
	 *
	 * Checks if the class has a method call (rest-method)_args.
	 * If it does, the function calls it and adds its response to the config object passed to the function, under the /args/ key.
	 * @param string $method The REST method name being configured
	 * @param array $config The configuration object for the method
	 *
	 * @return array The configuration object for the method, possibly after being amended
	 */
	public function maybe_add_args_to_config( string $method, array $config ): array {
		$method_name = strtolower( $method );
		$method_args = $method_name . '_args';
		if ( $this->method_exists_in_current_class( $method_args ) ) {
			$config['args'] = $this->{$method_args}();
		}
		return $config;
	}

	/**
	 * maybe_add_response_to_swagger
	 *
	 * If the function method /(rest-method)_response_callback/ exists, adds the filter
	 * /swagger_api_response_(namespace with slashes replaced with underscores)_(endpoint with slashes replaced with underscores)/
	 * with the aforementioned function method.
	 * This filter is used with the WP API Swagger UI plugin to create documentation for the API.
	 * The value being passed is an array: [
	'200' => ['description' => 'OK'],
	'404' => ['description' => 'Not Found'],
	'400' => ['description' => 'Bad Request']
	]
	 * @param string $method REST method name
	 */
	public function maybe_add_response_to_swagger( string $method ): void {
		$method_name = strtolower( $method );
		$method_response_callback = $method_name . '_response_callback';
		if ( $this->method_exists_in_current_class( $method_response_callback ) ) {
			$response_filter = $method_name . '_' . str_replace(
				'/',
				'_',
				$this->namespace . '/' . $this->get_endpoint()
			);
			add_filter( 'swagger_api_responses_' . $response_filter, [ $this, $method_response_callback ] );
		}
	}

	/**
	 * build_endpoint_method_config
	 *
	 * Builds a configuration array for the endpoint based on the presence of the callback, permission, additional parameters,
	 * and response to Swagger member functions.
	 * @param string $method The REST method for the endpoint
	 *
	 * @return array The endpoint configuration for the method specified by the parameter
	 */
	private function build_endpoint_method_config( string $method ): array {
		$config = [
			'methods' => $method,
			'callback' => $this->get_callback_method( $method ),
			'permission_callback' => $this->get_permission_callback_method( $method ),
		];
		$config = $this->maybe_add_args_to_config( $method, $config );
		return $config;
	}

	/**
	 * method_exists_in_current_class
	 *
	 * Uses reflection to check if this class has the /method/ method.
	 * @param string $method The name of the method being checked.
	 *
	 * @return bool TRUE if the class has the /method/ method, FALSE otherwise.
	 */
	private function method_exists_in_current_class( string $method ): bool {
		$class_name = get_class( $this );
		try {
			$reflection = new ReflectionClass( $class_name );
		} catch ( \ReflectionException $e ) {
			return false;
		}
		if ( ! $reflection->hasMethod( $method ) ) {
			return false;
		}
		$method_ref = $reflection->getMethod( $method );

		return ( $method_ref && $class_name === $method_ref->class );
	}

	/**
	 * @param $data
	 *
	 * @return WP_REST_Response
	 */
	public function respond_success_json( $data = [] ): WP_REST_Response {
		return new WP_REST_Response([
			'success' => true,
			'data' => $data,
		]);
	}

	/**
	 * @param array{message: string, code: string} $data
	 *
	 * @return WP_Error
	 */
	public function respond_error_json( array $data ): WP_Error {
		if ( ! isset( $data['message'] ) || ! isset( $data['code'] ) ) {
			_doing_it_wrong(
				__FUNCTION__,
				esc_html__( 'Both `message` and `code` keys must be provided', 'pojo-accessibility' ),
				'1.0.0'
			); // @codeCoverageIgnore
		}

		return new WP_Error(
			$data['code'] ?? 'internal_server_error',
			$data['message'] ?? esc_html__( 'Internal server error', 'pojo-accessibility' ),
		);
	}

	public function verify_capability( $capability = 'manage_options' ) {
		if ( ! current_user_can( $capability ) ) {
			return $this->respond_error_json([
				'message' => esc_html__( 'You do not have sufficient permissions to access this data.', 'pojo-accessibility' ),
				'code' => '401 Unauthorized',
			]);
		}
	}

	/**
	 * permission_callback
	 * Permissions callback fallback for the endpoint
	 * Gets the current user ID and sets the /current_user_id/ property.
	 * If the /auth/ property is set to /true/ will make sure that the user is logged in (has an id greater than 0)
	 *
	 * @param WP_REST_Request $request unused
	 *
	 * @return bool TRUE, if permission granted, FALSE otherwise
	 */
	public function permission_callback( WP_REST_Request $request ): bool {
		// try to get current user
		$this->current_user_id = get_current_user_id();
		if ( $this->auth ) {
			return $this->current_user_id > 0;
		}

		return true;
	}

	/**
	 * callback
	 * Fallback callback function, returns a response consisting of the string /ok/.
	 *
	 * @param WP_REST_Request $request unused
	 *
	 * @return WP_REST_Response Default Response of the string 'ok'.
	 */
	public function callback( WP_REST_Request $request ): WP_REST_Response {
		return rest_ensure_response( [ 'OK' ] );
	}

	/**
	 * respond_wrong_method
	 *
	 * Creates a WordPress error object with the /rest_no_route/ code and the message and code supplied or the defaults.
	 * @param null $message The error message for the wrong method.
	 * Optional.
	 * Defaults to null, which makes sets the message to /No route was found matching the URL and request method/
	 * @param int $code The HTTP status code.
	 * Optional.
	 * Defaults to 404 (Not found).
	 *
	 * @return WP_Error The WordPress error object with the error message and status code supplied
	 */
	public function respond_wrong_method( $message = null, int $code = 404 ): WP_Error {
		if ( null === $message ) {
			$message = __( 'No route was found matching the URL and request method', 'pojo-accessibility' );
		}

		return new WP_Error( 'rest_no_route', $message, [ 'status' => $code ] );
	}

	/**
	 * respond_with_code
	 * Create a new /WP_REST_Response/ object with the specified data and HTTP response code.
	 *
	 * @param array|null $data The data to return in this response
	 * @param int $code The HTTP response code.
	 * Optional.
	 * Defaults to 200 (OK).
	 *
	 * @return WP_REST_Response The WordPress response object loaded with the data and the response code.
	 */
	public function respond_with_code( ?array $data = null, int $code = 200 ): WP_REST_Response {
		return new WP_REST_Response( $data, $code );
	}

	/**
	 * get_user_from_request
	 *
	 * Returns the current user object.
	 * Depends on the property /current_user_id/ to be set.
	 * @return WP_User|false The user object or false if not found or on error.
	 */
	public function get_user_from_request() {
		return get_user_by( 'id', $this->current_user_id );
	}

	/**
	 * get_arguments
	 * Rest Endpoint extra arguments
	 * @return array Additional arguments for the route configuration
	 */
	public function get_arguments(): array {
		return [];
	}

	/**
	 * get_endpoint
	 * Rest route Endpoint
	 * @return string Endpoint uri component (comes after the route namespace)
	 */
	abstract public function get_endpoint(): string;

	/**
	 * get_name
	 * @return string The name of the route
	 */
	abstract public function get_name(): string;

	/**
	 * get_self_url
	 *
	 * @param string $endpoint
	 *
	 * @return string
	 */
	public function get_self_url( string $endpoint = '' ): string {
		return rest_url( $this->namespace . '/' . $endpoint );
	}

	public function verify_nonce( $nonce = '', $name = '' ) {
		if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $nonce ) ), $name ) ) {
			return $this->respond_error_json([
				'message' => esc_html__( 'Invalid nonce', 'pojo-accessibility' ),
				'code' => 'bad_request',
			]);
		}
	}

	public function verify_nonce_and_capability( $nonce = '', $name = '', $capability = 'manage_options' ) {
		$valid = $this->verify_nonce( $nonce, $name );

		if ( is_wp_error( $valid ) ) {
			return $valid;
		}

		if ( ! current_user_can( $capability ) ) {
			return $this->respond_error_json([
				'message' => esc_html__( 'You do not have sufficient permissions to access this data.', 'pojo-accessibility' ),
				'code' => 'bad_request',
			]);
		}
	}

}
