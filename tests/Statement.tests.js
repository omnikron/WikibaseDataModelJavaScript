/**
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, $, QUnit ) {
	'use strict';

QUnit.module( 'wikibase.datamodel.Statement' );

QUnit.test( 'Constructor', function( assert ) {
	var argumentLists = [
		{
			claim: new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'p1' ) )
		}, {
			claim: new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'p1' ) ),
			references: new wb.datamodel.ReferenceList( [
				new wb.datamodel.Reference(),
				new wb.datamodel.Reference( new wb.datamodel.SnakList( [
					new wb.datamodel.PropertyNoValueSnak( 'p10' )
				] ) )
			] ),
			rank: wb.datamodel.Statement.RANK.PREFERRED
		}
	];

	$.each( argumentLists, function( i, args ) {
		var claim = new wb.datamodel.Statement( args.claim, args.references, args.rank );

		assert.ok(
			claim.getClaim().equals( args.claim ),
			'Claim is set correctly.'
		);

		assert.ok(
			claim.getReferences().equals( args.references || new wb.datamodel.ReferenceList() ),
			'References are set correctly.'
		);

		assert.ok(
			claim.getRank() === ( args.rank || wb.datamodel.Statement.RANK.NORMAL ),
			'Rank is set correctly.'
		);
	} );

	assert.throws(
		function() {
			return new wb.datamodel.Statement();
		},
		'Throwing error when trying to instantiate a Statement without a Claim.'
	);
} );

QUnit.test( 'Rank evaluation on instantiation', function( assert ) {
	var statement = new wb.datamodel.Statement(
		new wb.datamodel.Claim(
			new wb.datamodel.PropertyNoValueSnak( 'P1' )
		)
	);

	assert.equal(
		statement.getRank(),
		wb.datamodel.Statement.RANK.NORMAL,
		'Assigning \'normal\' rank by default.'
	);

	statement = new wb.datamodel.Statement(
		new wb.datamodel.Claim(
			new wb.datamodel.PropertyNoValueSnak( 'P1' )
		),
		null,
		wb.datamodel.Statement.RANK.DEPRECATED
	);

	assert.equal(
		statement.getRank(),
		wb.datamodel.Statement.RANK.DEPRECATED,
		'Instantiated statement object with \'deprecated\' rank.'
	);
} );

QUnit.test( 'setRank() & getRank()', function( assert ) {
	var statement = new wb.datamodel.Statement(
		new wb.datamodel.Claim(
			new wb.datamodel.PropertyNoValueSnak( 'P1' )
		)
	);

	statement.setRank( wb.datamodel.Statement.RANK.PREFERRED );

	assert.equal(
		statement.getRank(),
		wb.datamodel.Statement.RANK.PREFERRED,
		'Assigned \'preferred\' rank.'
	);

	statement.setRank( wb.datamodel.Statement.RANK.DEPRECATED );

	assert.equal(
		statement.getRank(),
		wb.datamodel.Statement.RANK.DEPRECATED,
		'Assigned \'deprecated\' rank.'
	);

	statement.setRank( wb.datamodel.Statement.RANK.NORMAL );

	assert.equal(
		statement.getRank(),
		wb.datamodel.Statement.RANK.NORMAL,
		'Assigned \'normal\' rank.'
	);
} );

QUnit.test( 'equals()', function( assert ) {
	var statements = [
		new wb.datamodel.Statement(
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) )
		),
		new wb.datamodel.Statement(
			new wb.datamodel.Claim( new wb.datamodel.PropertySomeValueSnak( 'P1' ) )
		),
		new wb.datamodel.Statement(
			new wb.datamodel.Claim( new wb.datamodel.PropertySomeValueSnak( 'P1' ) ),
			null,
			wb.datamodel.Statement.RANK.PREFERRED
		),
		new wb.datamodel.Statement(
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) ),
			new wb.datamodel.ReferenceList(
				[new wb.datamodel.Reference( new wb.datamodel.SnakList(
					[new wb.datamodel.PropertyNoValueSnak( 'P10' ) ]
				) )]
			),
			wb.datamodel.Statement.RANK.PREFERRED
		),
		new wb.datamodel.Statement(
			new wb.datamodel.Claim( new wb.datamodel.PropertyNoValueSnak( 'P1' ) ),
			new wb.datamodel.ReferenceList(
				[new wb.datamodel.Reference( new wb.datamodel.SnakList(
					[new wb.datamodel.PropertySomeValueSnak( 'P10' ) ]
				) )]
			),
			wb.datamodel.Statement.RANK.PREFERRED
		)
	];

	// Compare statements:
	$.each( statements, function( i, statement ) {
		var clonedStatement = new wb.datamodel.Statement(
			new wb.datamodel.Claim(
				statement.getClaim().getMainSnak(),
				statement.getClaim().getQualifiers(),
				statement.getClaim().getGuid()
			),
			statement.getReferences(),
			statement.getRank()
		);

		// Check if "cloned" statement is equal:
		assert.ok(
			statement.equals( clonedStatement ),
			'Verified statement "' + i + '" on equality.'
		);

		// Compare to all other statements:
		$.each( statements, function( j, otherStatement ) {
			if ( j !== i ) {
				assert.ok(
					!statement.equals( otherStatement ),
					'Statement "' + i + '" is not equal to statement "'+ j + '".'
				);
			}
		} );

	} );

	// Compare claim to statement:
	var claim = new wb.datamodel.Claim(
			new wb.datamodel.PropertyNoValueSnak( 'P1' )
		),
		statement = new wb.datamodel.Statement(
			new wb.datamodel.Claim(
				new wb.datamodel.PropertyNoValueSnak( 'P1' )
			)
		);

	assert.ok(
		!statement.equals( claim ),
		'Statement does not equal claim that received the same initialization parameters.'
	);

} );

}( wikibase, jQuery, QUnit ) );
