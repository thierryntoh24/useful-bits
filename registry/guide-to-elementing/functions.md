## Table Of Contents

[Back to home](readme.md)

- [Table Of Contents](#table-of-contents)
- [Overview](#overview)
- [WP Defaults](#wp-defaults)
- [`get_post( $post = null)`](#get_post-post--null)
- [`get_the_title( $post_id = 0 )`](#get_the_title-post_id--0-)
- [`get_the_ID()`](#get_the_id)
- [`get_permalink( $post_id = 0 )`](#get_permalink-post_id--0-)
- [`get_next_post( $in_same_term = false, $excluded_terms = '', $taxonomy = 'category')`](#get_next_post-in_same_term--false-excluded_terms---taxonomy--category)
- [`get_previous_post( $in_same_term = false, $excluded_terms = '', $taxonomy = 'category')`](#get_previous_post-in_same_term--false-excluded_terms---taxonomy--category)
- [ACF Functions](#acf-functions)
- [`get_field( $field_name, $post_id = false, $format_value = true )`](#get_field-field_name-post_id--false-format_value--true-)
- [`acf_shortcode( $atts )`](#acf_shortcode-atts-)
- [Handy Code Snippets](#handy-code-snippets)
- [Register, enqueue, add inline script and localise data](#register-enqueue-add-inline-script-and-localise-data)
	- [`wp_register_script( $handle, $src, $deps, $ver, $args );`](#wp_register_script-handle-src-deps-ver-args-)
	- [`wp_enqueue_script( $handle, $src, $deps, $ver, $args );`](#wp_enqueue_script-handle-src-deps-ver-args-)
	- [`wp_localize_script( $handle, $object_name, $l10n )`](#wp_localize_script-handle-object_name-l10n-)
	- [`wp_add_inline_script( $handle, $data, $position = 'after' )`](#wp_add_inline_script-handle-data-position--after-)
- [get\_post\_index](#get_post_index)
- [get\_next\_post\_data](#get_next_post_data)
- [WooCommerce](#woocommerce)
- [get\_product\_igtn (Product GTIN EAN, UPC, ISBN)](#get_product_igtn-product-gtin-ean-upc-isbn)
- [Get product stock quantity](#get-product-stock-quantity)
- [Get product attribute single (Size)](#get-product-attribute-single-size)
- [Get product attribute variable (incomplete)](#get-product-attribute-variable-incomplete)
- [Get Product SKU](#get-product-sku)
- [Other Handy Methods + Console Debug](#other-handy-methods--console-debug)

## Overview

**_`Appearance > Theme Functions > Functions`_**

## WP Defaults

`../wp-includes\post-template.php`

### `get_post( $post = null)`

Retrieves post data given a post ID or post object.

### `get_the_title( $post_id = 0 )`

Get the title of the current post.
Alternatively, `the_title( $before = '', $after = '', $display = true )`

### `get_the_ID()`

Get the ID of the current post.
Alt, `the_ID()`

### `get_permalink( $post_id = 0 )`

Retrieves the full permalink for the current post or post ID.

### `get_next_post( $in_same_term = false, $excluded_terms = '', $taxonomy = 'category')`

Retrieves the next post that is adjacent to the current post.

### `get_previous_post( $in_same_term = false, $excluded_terms = '', $taxonomy = 'category')`

Retrieves the previous post that is adjacent to the current post.

## ACF Functions

### `get_field( $field_name, $post_id = false, $format_value = true )`

```php
/**
*  get_field()
*
*  This function will return a custom field value for a specific field name/key + post_id.
*  There is a 3rd parameter to turn on/off formating. This means that an image field will not use
*  its 'return option' to format the value but return only what was saved in the database
*
*  @param   $selector (string) the field name or key
*  @param   $post_id (mixed) the post_id of which the value is saved against
*  @param   $format_value (boolean) whether or not to format the value as described above
*  @return  (mixed)
*/
```

### `acf_shortcode( $atts )`

```php
/**
 * This function is used to add basic shortcode support for the ACF plugin
 * eg. [acf field="heading" post_id="123" format_value="1"]
 *
 * @param array $atts The shortcode attributes.
 *
 * @return string
 */
```

## Handy Code Snippets

### Register, enqueue, add inline script and localise data

```php
wp_register_script( 'js-header', '', array(), false, true);

wp_enqueue_script( 'js-header' );

function my_localize_script() {
$data = array( 'name' => 'John', 'age' => 25,  );
wp_localize_script( 'js-header', 'my_data', $data );
}

add_action( 'wp_enqueue_scripts', 'my_localize_script' );

wp_add_inline_script( 'js-header', "console.log(my_data);");
```

```php
/**
 * Example usage of wp_add_inline_script
 *
 * Add to theme child's functions.php.
 */

define('CME_LOCOMOTIVE_SCROLL_NAME', 'cme-locomotive-scroll');

function enqueue_locomotive_scroll_javascript()
{
// Put in footer, but before inline script to instantiate LocomotiveScroll.
wp_register_script(CME_LOCOMOTIVE_SCROLL_NAME, 'https://cdn.jsdelivr.net/gh/locomotivemtl/locomotive-scroll/dist/locomotive-scroll.min.js', array(), CME_LOCOMOTIVE_SCROLL_VERSION, true);

wp_enqueue_script(CME_LOCOMOTIVE_SCROLL_NAME);

// This must be loaded after the library above to avoid a JavaScript error.
$script = '
(function() {
	let bodyDataScrollContainer = document.querySelector("body");
	bodyDataScrollContainer.setAttribute("data-scroll-container", "");
	let mainDataScrollSection = document.querySelector("main");
	mainDataScrollSection.setAttribute("data-scroll-section", "");
})();
const scroll = new LocomotiveScroll({
	el: document.querySelector("[data-scroll-container]"),
	smooth: true
});
';

// Load this inline after the above library loads.
wp_add_inline_script(CME_LOCOMOTIVE_SCROLL_NAME, $script, 'after');

}
add_action('wp_enqueue_scripts', 'enqueue_locomotive_scroll_javascript');
```

**Code Breakdown**

#### `wp_register_script( $handle, $src, $deps, $ver, $args );`

https://developer.wordpress.org/reference/functions/wp_register_script/

Registers a script to be enqueued later using the `wp_enqueue_script()` function.

```php
wp_register_script(
'foo',
'/path/to/foo.js',
array(),
'1.0.0',
array(
	'strategy'  => 'defer',
	'in_footer '  => true,
)
);

//  wp_register_script( 'foo', '' , '', '', true );

// The same approach applies when using wp_enqueue_script() .
```

#### `wp_enqueue_script( $handle, $src, $deps, $ver, $args );`

https://developer.wordpress.org/reference/functions/wp_enqueue_script/

Registers the script if $src provided (does NOT overwrite), and enqueues it.

```php
/**
 * Proper way to enqueue scripts and styles.
 */

function enqueue_func() {
wp_register_script( 'foo', '' , '', '', true );
wp_enqueue_script( 'foo', '/js/example.js', array(), '1.0.0', true );

// wp_enqueue_script( 'foo', '' , '', '', true );
}

add_action( 'wp_enqueue_scripts', 'enqueue_func' );
```

#### `wp_localize_script( $handle, $object_name, $l10n )`

Localizes a script.
Works only if the script has already been registered.

```php
function my_localize_script() {
$data = array('name' => 'John', 'age' => 25 );
wp_localize_script( 'my-script', 'my_data', data );
}
add_action( 'wp_enqueue_scripts', 'my_localize_script' );

/**
 * The data is passed as a JavaScript object with the name ‘my_data’. In your script, you can access the data like this:
 *
 * console.log( my_data.name ); // Outputs 'John'
 * console.log( my_data.age ); // Outputs 25
*/
```

#### `wp_add_inline_script( $handle, $data, $position = 'after' )`

Adds extra code to a registered script.
Code will only be added if the script is already in the queue.

```php
wp_register_script( 'myprefix-dummy-js-footer', '', array("jquery"), '', true );

wp_enqueue_script( 'myprefix-dummy-js-footer'  );
wp_add_inline_script( 'myprefix-dummy-js-footer', "console.log('loaded in footer');");
```

```php
wp_enqueue_script( 'my-script', 'https://url-to/my-script.js' );

// Alternative to wp_localize_script()
wp_add_inline_script( 'my-script', 'const my_data = ' . json_encode( array(
	'name' => 'John',
	'age' => 25
) ), 'before' );
```

### get_post_index

```php
function get_post_index() {

$allPosts = get_posts(['numberposts' => -1,	'post_status' => 'publish',]);
$index = 0;

foreach ($allPosts as $p) {
	$index++;
	if ($p->ID == get_the_ID()) { break; }
}

return ($index < 10) ? "0{$index}" : $index;
}

add_shortcode( 'post_index', 'get_post_index' );
```

### get_next_post_data

```php
function get_next_post_data($atts) {

$atts = shortcode_atts(array('image' => false, 'link' => false,), $atts);

$next_post = (is_a(get_next_post(), 'WP_Post'))
	? get_next_post()->ID
	: get_posts([
		'numberposts' => 1,
		'post_status' => 'publish'
		])[0]->ID;

if ($atts['image']) return get_the_post_thumbnail($next_post, 'medium');
elseif ($atts['link']) return get_permalink($next_post);
else return $next_post;
}

add_shortcode('next_post', 'get_next_post_data');
```

## WooCommerce

### get_product_igtn (Product GTIN EAN, UPC, ISBN)

```php
function get_product_gtin() {
if ( !is_product() ) {
	return;
}

//global $post;
$product = wc_get_product(get_the_ID());

//if ( ! is_object( $product ) ) {
//$product = wc_get_product( get_the_ID() );

if ($product) {
	$gtin = $product->get_global_unique_id();
	return $gtin ? $gtin : 'GTIN not available';
}
return 'Product not found';
}

add_shortcode('product_gtin', 'get_product_gtin');
```

### Get product stock quantity

```php
function get_product_stock() {
//global $post;
$product = wc_get_product(get_the_ID());
if ($product) {
	return $product->get_stock_quantity();
}
return 'Product not found';
}

add_shortcode('product_stock', 'get_product_stock');
```

### Get product attribute single (Size)

```php
function get_product_size() {
//global $post;
$product = wc_get_product(get_the_ID());
if ($product) {
	$value = wc_get_product_terms($product->get_id(), 'pa_size', array('fields' => 'names'));
	return $value ? $value[0] : 'Size not available';
}
return 'Product not found';
}

add_shortcode('product_size', 'get_product_size');
```
### Get product attribute variable (incomplete)

```php
function get_product_attribute($attribute_name) {
//global $post;
//$product = wc_get_product($post->ID);

if ( !is_product() ) {
	return;
}

global $product;

if ( ! is_object( $product ) ) {
	$product = wc_get_product( get_the_ID() );
}

if ($product) {
	$attributes = $product->get_attributes();  // Retrieves all attributes for the product

	if (isset($attributes[$attribute_name])) {
		$attribute = $attributes[$attribute_name];

		// For taxonomy-based attributes like 'size' or 'brand'
		if ($attribute->is_taxonomy()) {
			$terms = wp_get_post_terms($product->get_id(), $attribute->get_name(), ['fields' => 'names']);
			return implode(', ', $terms);  // Returns a comma-separated list if multiple terms are found
		} else {
			// For custom product attributes not using a taxonomy
			return $attribute->get_options()[0];
		}
	}
}
return '';
}

add_shortcode('product_attribute', function($atts) {
$atts = shortcode_atts(['name' => ''], $atts);
return get_product_attribute($atts['name']);
});

```

### Get Product SKU

```php
function get_product_sku() {
global $post;
$product = wc_get_product($post->ID);
if ($product) {
	return $product->get_sku();  // Retrieves the SKU
}
return '';
}

add_shortcode('product_sku', 'get_product_sku');
```

### Other Handy Methods + Console Debug

```php
wp_register_script( 'js-header', '', array(), false, true);

wp_enqueue_script( 'js-header' );

function my_localize_script() {
if ( !is_product() ) {
	return;
}

global $product;
$product_data;
$attributes = array('pa_brand', 'pa_size', 'pa_color', 'pa_gender');
$vals = [];


if ( ! is_object( $product ) ) {
	$product = wc_get_product( get_the_ID() );

	foreach ($attributes as $tax) {
		$vals[] = wc_get_product_terms($product->get_id(), $tax, array('fields' => 'names'));
	}

	$product_data = array(
		'id' => $product->get_id(),
		'name' => $product->get_name(),
		'price' => $product->get_price(),
		'sku' => $product->get_sku(),
		'description' => $product->get_description(),
		'c_attributes' => $vals,
		'attributes' => $product->get_attributes(),
		'gtin' =>  $product->get_global_unique_id(),
		// 'attributes' => $product->get_attributes(),
		// Add more properties as needed
	);

}

// Localize the product data for use in JavaScript
wp_localize_script('js-header', 'productData', $product_data);
}

add_action( 'wp_enqueue_scripts', 'my_localize_script' );

wp_add_inline_script( 'js-header', "console.log(productData);");
```