/**
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, $ ) {
'use strict';

var PARENT = wb.datamodel.Groupable;

/**
 * Ordered list.
 * @constructor
 * @since 1.0
 *
 * @param {Function} ItemConstructor
 * @param {*[]} [items]
 */
var SELF = wb.datamodel.List = util.inherit( 'WbDataModelList', PARENT, function( ItemConstructor, items ) {
	if( !$.isFunction( ItemConstructor ) ) {
		throw new Error( 'Item constructor needs to be a Function' );
	} else if( !$.isFunction( ItemConstructor.prototype.equals ) ) {
		throw new Error( 'List item prototype needs equals() method' );
	}

	items = items || [];

	this._ItemConstructor = ItemConstructor;
	this._items = [];
	this.length = 0;

	for( var i = 0; i < items.length; i++ ) {
		this.addItem( items[i] );
	}
}, {
	/**
	 * @type {Function}
	 */
	_ItemConstructor: null,

	/**
	 * @type {*[]}
	 */
	_items: null,

	/**
	 * @type {number}
	 */
	length: 0,

	/**
	 * @see jQuery.fn.each
	 */
	each: function( fn ) {
		$.each.call( null, this._items, fn );
	},

	/**
	 * @return {*[]}
	 */
	toArray: function() {
		return this._items.slice();
	},

	/**
	 * @param {*} item
	 * @return {boolean}
	 */
	hasItem: function( item ) {
		this._assertIsItem( item );

		for( var i = 0; i < this._items.length; i++ ) {
			if( this._items[i].equals( item ) ) {
				return true;
			}
		}
		return false;
	},

	/**
	 * @param {*} item
	 */
	addItem: function( item ) {
		this._assertIsItem( item );

		this._items.push( item );
		this.length++;
	},

	/**
	 * @param {*} item
	 */
	removeItem: function( item ) {
		this._assertIsItem( item );

		for( var i = 0; i < this._items.length; i++ ) {
			if( this._items[i].equals( item ) ) {
				this._items.splice( i, 1 );
				this.length--;
				return;
			}
		}
		throw new Error( 'Trying to remove a non-existing claim' );
	},

	/**
	 * @return {boolean}
	 */
	isEmpty: function() {
		return this.length === 0;
	},

	/**
	 * @param {*} list
	 * @return {boolean}
	 */
	equals: function( list ) {
		if( list === this ) {
			return true;
		} else if( !( list instanceof SELF ) || this.length !== list.length ) {
			return false;
		}

		for( var i = 0; i < this._items.length; i++ ) {
			if( list.indexOf( this._items[i] ) !== i ) {
				return false;
			}
		}

		return true;
	},

	/**
	 * @param {*} item
	 * @return {number}
	 */
	indexOf: function( item ) {
		this._assertIsItem( item );

		for( var i = 0; i < this._items.length; i++ ) {
			if( this._items[i].equals( item ) ) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * @param {*} item
	 */
	_assertIsItem: function( item ) {
		if( !( item instanceof this._ItemConstructor ) ) {
			throw new Error( 'Item is not an instance of the constructor set on the list' );
		}
	}

} );

}( wikibase, jQuery ) );
