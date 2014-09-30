/**
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, QUnit ) {
'use strict';

QUnit.module( 'wikibase.datamodel.TermGroupList' );

var testSets = [
	[],
	[
		new wb.datamodel.TermGroup( 'de', ['de-string'] ),
		new wb.datamodel.TermGroup( 'en', ['en-string'] )
	]
];

QUnit.test( 'Constructor', function( assert ) {
	for( var i = 0; i < testSets.length; i++ ) {
		assert.ok(
			( new wb.datamodel.TermGroupList( testSets[i] ) ) instanceof wb.datamodel.TermGroupList,
			'Test set #' + i + ': Instantiated TermGroupList.'
		);
	}

	assert.throws(
		function() {
			return new wb.datamodel.TermGroupList( ['string1', 'string2'] );
		},
		'Throwing error when trying to instantiate a TermGroupList without TermGroup objects.'
	);
} );

}( wikibase, QUnit ) );
