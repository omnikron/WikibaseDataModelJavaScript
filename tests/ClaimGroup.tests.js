/**
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, QUnit ) {
'use strict';

QUnit.module( 'wikibase.datamodel.ClaimGroup' );

/**
 * @return {wikibase.datamodel.ClaimGroup}
 */
function getDefaultClaimGroup() {
	return new wb.datamodel.ClaimGroup( 'P1', new wb.datamodel.ClaimList( [
		new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) )
	] ) );
}

QUnit.test( 'Constructor', function( assert ) {
	var claimGroup = getDefaultClaimGroup();

	assert.ok(
		claimGroup instanceof wb.datamodel.ClaimGroup,
		'Instantiated ClaimGroup.'
	);

	assert.equal(
		claimGroup.getKey(),
		'P1',
		'Verified property id.'
	);

	assert.ok(
		claimGroup.getItemList().equals( new wb.datamodel.ClaimList( [
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) )
		] ) ),
		'Verified ClaimList.'
	);

	assert.throws(
		function() {
			return new wb.datamodel.ClaimGroup( 'P1', new wb.datamodel.ClaimList( [
				new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P2' ) )
			] ) );
		},
		'Throwing error when trying to instantiate ClaimGroup mismatching property ids.'
	);
} );

QUnit.test( 'setItemList() & getItemList()', function( assert ) {
	var claimGroup = getDefaultClaimGroup(),
		claimList = new wb.datamodel.ClaimList( [
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) )
		] );

	assert.ok(
		claimGroup.getItemList() !== new wb.datamodel.ClaimList( [
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) )
		] ),
		'Not returning original ClaimList object.'
	);

	claimGroup.setItemList( claimList );

	assert.ok(
		claimGroup.getItemList().equals( claimList ),
		'Set new ClaimList.'
	);

	assert.throws(
		function() {
			claimGroup.setItemList( new wb.datamodel.ClaimList( [
				new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P2' ) )
			] ) );
		},
		'Throwing error when trying to set a ClaimList with mismatching property id.'
	);
} );

QUnit.test( 'addItem() & hasItem()', function( assert ) {
	var claimGroup = getDefaultClaimGroup();

	claimGroup.addItem(
		new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ), null, 'guid' )
	);

	assert.ok(
		claimGroup.hasItem(
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ), null, 'guid' )
		),
		'Verified having added a Claim.'
	);

	assert.throws(
		function() {
			claimGroup.addItem(
				new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P2' ) )
			);
		},
		'Throwing error when trying to add a Claim that does not match the ClaimGroup '
			+ 'object\'s property id.'
	);
} );

QUnit.test( 'equals()', function( assert ) {
	var claimGroup = getDefaultClaimGroup();

	assert.ok(
		claimGroup.equals( getDefaultClaimGroup() ),
		'Verified equals() retuning TRUE.'
	);

	claimGroup.addItem(
		new wb.datamodel.Claim( new wb.datamodel.PropertySomeValueSnak( 'P1' ) )
	);

	assert.ok(
		!claimGroup.equals( getDefaultClaimGroup() ),
		'FALSE after adding another Claim object.'
	);
} );

}( wikibase, QUnit ) );
