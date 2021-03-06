( function( wb, $ ) {
'use strict';

/**
 * References a container of which all items feature the key specified with the Group.
 * @class wikibase.datamodel.Group
 * @since 1.0
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 *
 * @constructor
 *
 * @param {*} key
 * @param {Function} GroupableCollectionConstructor
 * @param {string} groupableCollectionGetKeysFunctionName
 * @param {wikibase.datamodel.GroupableCollection} [groupableCollection=new GroupableCollectionConstructor()]
 *
 * @throws {Error} if a required parameter is not specified properly.
 */
var SELF = wb.datamodel.Group = function WbDataModelGroup(
	key,
	GroupableCollectionConstructor,
	groupableCollectionGetKeysFunctionName,
	groupableCollection
) {
	if( key === undefined ) {
		throw new Error( 'Key may not be undefined' );
	}
	if( !$.isFunction( GroupableCollectionConstructor ) ) {
		throw new Error( 'Item container constructor needs to be a Function' );
	}
	if( !( ( new GroupableCollectionConstructor() ) instanceof wb.datamodel.GroupableCollection ) ) {
		throw new Error( 'Item container constructor needs to implement GroupableCollection' );
	}
	if( !$.isFunction(
		GroupableCollectionConstructor.prototype[groupableCollectionGetKeysFunctionName]
	) ) {
		throw new Error( 'Missing ' + GroupableCollectionConstructor + '() in container item '
			+ 'prototype to receive the item key from' );
	}

	this._key = key;
	this._GroupableCollectionConstructor = GroupableCollectionConstructor;
	this._groupableCollectionGetKeysFunctionName = groupableCollectionGetKeysFunctionName;
	this.setItemContainer( groupableCollection || new GroupableCollectionConstructor() );
};

$.extend( SELF.prototype, {
	/**
	 * @property {*}
	 * @private
	 */
	_key: null,

	/**
	 * @property {Function}
	 * @private
	 */
	_GroupableCollectionConstructor: null,

	/**
	 * @property {string}
	 * @private
	 */
	_groupableCollectionGetKeysFunctionName: null,

	/**
	 * @property {wikibase.datamodel.GroupableCollection}
	 * @private
	 */
	_groupableCollection: null,

	/**
	 * @return {*}
	 */
	getKey: function() {
		return this._key;
	},

	/**
	 * @return {*}
	 */
	getItemContainer: function() {
		// Do not allow altering the encapsulated container.
		return new this._GroupableCollectionConstructor( this._groupableCollection.toArray() );
	},

	/**
	 * @param {*} groupableCollection
	 *
	 * @throws {Error} when passed GroupableCollection instance contains an item whose key does not
	 *         match the key registered with the Group instance.
	 */
	setItemContainer: function( groupableCollection ) {
		var keys = this._getItemContainerKeys( groupableCollection );

		for( var i = 0; i < keys.length; i++ ) {
			if( keys[i] !== this._key ) {
				throw new Error( 'Mismatching key: Expected ' + this._key + ', received '
					+ keys[i] );
			}
		}

		// Clone the container to prevent manipulation of the items using the original container.
		this._groupableCollection = new this._GroupableCollectionConstructor(
			groupableCollection.toArray()
		);
	},

	/**
	 * @param {*} groupableCollection
	 * @return {string}
	 * @private
	 */
	_getItemContainerKeys: function( groupableCollection ) {
		return groupableCollection[this._groupableCollectionGetKeysFunctionName]();
	},

	/**
	 * @param {*} item
	 * @return {boolean}
	 */
	hasItem: function( item ) {
		return this._groupableCollection.hasItem( item );
	},

	/**
	 * @param {*} item
	 *
	 * @throws {Error} when trying to add an item whose key does not match the key registered with
	 *         the Group instance.
	 */
	addItem: function( item ) {
		if( this._groupableCollection.getItemKey( item ) !== this._key ) {
			throw new Error(
				'Mismatching key: Expected ' + this._key + ', received '
					+ this._groupableCollection.getItemKey( item )
			);
		}
		this._groupableCollection.addItem( item );
	},

	/**
	 * @param {*} item
	 */
	removeItem: function( item ) {
		this._groupableCollection.removeItem( item );
	},

	/**
	 * @return {boolean}
	 */
	isEmpty: function() {
		return this._groupableCollection.isEmpty();
	},

	/**
	 * @param {*} group
	 * @return {boolean}
	 */
	equals: function( group ) {
		return group === this
			|| group instanceof SELF
				&& this._key === group.getKey()
				&& this._groupableCollection.equals( group.getItemContainer() );
	}

} );

}( wikibase, jQuery ) );
