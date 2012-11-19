/**
 * @file
 * @ingroup Wikibase
 * @licence GNU GPL v2+
 * @author Daniel Werner
 */
( function( wb, $, undefined ) {
'use strict';

var PARENT = wb.Claim,
	constructor = function( mainSnak, qualifiers, references ) {
		PARENT.call( this, mainSnak, qualifiers );
		this._references = references;
		this._rank = this.RANK.NORMAL;
	};

/**
 * Represents a Wikibase Statement in JavaScript.
 * @constructor
 * @extends wb.Claim
 * @since 0.2
 * @see https://meta.wikimedia.org/wiki/Wikidata/Data_model#Statements
 *
 * @param {wb.Snak} mainSnak
 * @param {wb.Snak[]} qualifiers
 * @param {wb.Snak[]} references
 */
wb.Statement = wb.utilities.inherit( PARENT, constructor, {
	/**
	 * Rank enum. Higher values are more preferred.
	 * @type Object
	 */
	RANK: {
		PREFERRED: 2,
		NORMAL: 1,
		DEPRECATED: 0
	},

	/**
	 * @type Array
	 * @todo determine whether we should rather model a Reference object for this
	 * @todo think about implementing a ReferenceList/ClaimList rather than having an Array here
	 */
	_references: null,

	/**
	 * @type Number
	 */
	_rank: null,

	/**
	 * Returns all of the statements references.
	 *
	 * sufficient
	 * @return Snak[]
	 */
	getReferences: function() {
		return this._references;
	},

	/**
	 * Overwrites the current set of the statements references.
	 *
	 * @param Snak[] references
	 */
	setReferences: function( references ) {
		this._references = references;
	},

	/**
	 * Allows to set the statements rank.
	 *
	 * @param {Number} rank one of the RANK enum
	 */
	setRank: function( rank ) {},

	/**
	 * Returns the rank of the statement.
	 *
	 * @return {Number} one of the RANK enum
	 */
	getRank: function() {}
} );

/**
 * Creates a new Statement object from a given JSON structure.
 *
 * @param {String} json
 * @return {wb.Statement}
 */
wb.Statement.newFromJSON = function( json ) {
	var mainSnak = wb.Snak.newFromJSON( json.mainsnak ),
		qualifiers = [],
		references = [];

	if ( json.qualifiers !== undefined ) {
		$.each( json.qualifiers, function( i, qualifier ) {
			qualifiers.push( wb.Snak.newFromJSON( qualifier ) );
		} );
	}

	if ( json.references !== undefined ) {
		$.each( json.references, function( i, reference ) {
			references.push( wb.Snak.newFromJSON( reference ) );
		} );
	}

	return new wb.Statement( mainSnak, qualifiers, references );
};

}( wikibase, jQuery ) );
