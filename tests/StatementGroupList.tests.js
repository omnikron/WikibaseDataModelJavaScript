/**
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, QUnit ) {
'use strict';

QUnit.module( 'wikibase.datamodel.StatementGroupList' );

var testSets = [
	[],
	[
		new wb.datamodel.StatementGroup( 'P1', new wb.datamodel.StatementList( [
			new wb.datamodel.Statement(
				new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) )
			)
		] ) ),
		new wb.datamodel.StatementGroup( 'P2', new wb.datamodel.StatementList( [
			new wb.datamodel.Statement(
				new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P2' ) )
			)
		] ) )
	]
];

QUnit.test( 'Constructor', function( assert ) {
	for( var i = 0; i < testSets.length; i++ ) {
		var statementGroupList = new wb.datamodel.StatementGroupList( testSets[i] );

		assert.ok(
			statementGroupList instanceof wb.datamodel.StatementGroupList,
			'Test set #' + i + ': Instantiated StatementGroupList.'
		);
	}
} );

}( wikibase, QUnit ) );
