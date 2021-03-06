/**
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, QUnit ) {
'use strict';

QUnit.module( 'wikibase.datamodel.List' );

/**
 * @constructor
 */
var TestItem = function() {};
TestItem.prototype.equals = function( other ) {
	return other === this;
};

/**
 * @param {number} n
 * @return {TestItem[]}
 */
function getTestItems( n ) {
	var items = [];

	for( var i = 0; i < n; i++ ) {
		items.push( new TestItem() );
	}

	return items;
}

QUnit.test( 'Constructor', function( assert ) {
	assert.ok(
		( new wb.datamodel.List( TestItem ) ) instanceof wb.datamodel.List,
		'Instantiated empty List.'
	);

	var list = new wb.datamodel.List( TestItem, getTestItems( 2 ) );

	assert.ok(
		list instanceof wb.datamodel.List,
		'Instantiated filled List.'
	);

	assert.equal(
		list.length,
		2,
		'Verified list length.'
	);

	assert.throws(
		function() {
			return new wb.datamodel.List();
		},
		'Throwing error when trying to instantiate a List without an item constructor.'
	);

	assert.throws(
		function() {
			return new wb.datamodel.List( 'string' );
		},
		'Throwing error when trying to instantiate a List with an improper item constructor.'
	);
} );

QUnit.test( 'each()', function( assert ) {
	var items = getTestItems( 2 ),
		list = new wb.datamodel.List( TestItem, items );

	list.each( function( i, item ) {
		assert.ok(
			item.equals( items[i] ),
			'Verified received item and index.'
		);
	} );
} );

QUnit.test( 'hasItem()', function( assert ) {
	var items = getTestItems( 3 ),
		list = new wb.datamodel.List( TestItem, items );

	assert.ok(
		list.hasItem( items[2] ),
		'Verified hasClaim() returning TRUE.'
	);

	assert.ok(
		!list.hasItem( getTestItems( 1 )[0] ),
		'Verified hasClaim() returning FALSE.'
	);
} );

QUnit.test( 'addItem() & length attribute', function( assert ) {
	var items = getTestItems( 3 ),
		newItems = getTestItems( 1 ),
		list = new wb.datamodel.List( TestItem, items );

	assert.equal(
		list.length,
		3,
		'List contains 3 items.'
	);

	list.addItem( newItems[0] );

	assert.ok(
		list.hasItem( newItems[0] ),
		'Added item.'
	);

	assert.equal(
		list.length,
		4,
		'Increased length.'
	);
} );

QUnit.test( 'removeItem()', function( assert ) {
	var items = getTestItems( 3 ),
		unsetItems = getTestItems( 1 ),
		list = new wb.datamodel.List( TestItem, items );

	assert.equal(
		list.length,
		3,
		'List contains 3 items.'
	);

	assert.throws(
		function() {
			list.removeItem( unsetItems[0] );
		},
		'Throwing error when trying to remove an item not set.'
	);

	list.removeItem( items[1] );

	assert.ok(
		!list.hasItem( items[1] ),
		'Removed item.'
	);

	assert.equal(
		list.length,
		2,
		'List contains 2 items.'
	);
} );

QUnit.test( 'isEmpty()', function( assert ) {
	var items = getTestItems( 1 ),
		list = new wb.datamodel.List( TestItem );

	assert.ok(
		list.isEmpty(),
		'Verified isEmpty() returning TRUE.'
	);

	list.addItem( items[0] );

	assert.ok(
		!list.isEmpty(),
		'Verified isEmpty() returning FALSE.'
	);

	list.removeItem( items[0] );

	assert.ok(
		list.isEmpty(),
		'TRUE after removing last Claim.'
	);
} );

QUnit.test( 'equals()', function( assert ) {
	var items = getTestItems( 3 ),
		list = new wb.datamodel.List( TestItem, items );

	assert.ok(
		list.equals( new wb.datamodel.List( TestItem, items ) ),
		'Verified equals() retuning TRUE.'
	);

	list.addItem( getTestItems( 1 )[0] );

	assert.ok(
		!list.equals( new wb.datamodel.List( TestItem, items ) ),
		'FALSE after adding another item object.'
	);
} );

QUnit.test( 'indexOf()', function( assert ) {
	var items = getTestItems( 3 ),
		list = new wb.datamodel.List( TestItem, items );

	assert.strictEqual(
		list.indexOf( items [1] ),
		1,
		'Retrieved correct index.'
	);
} );

}( wikibase, QUnit ) );
