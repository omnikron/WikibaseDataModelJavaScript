/**
 * @licence GNU GPL v2+
 * @author Daniel Werner < daniel.werner@wikimedia.de >
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, dv, $, QUnit ) {
	'use strict';

	QUnit.module( 'wikibase.datamodel.SnakList.js' );

	var snakSets = [
		[
			new wb.datamodel.PropertyNoValueSnak( 'p9001' ),
			new wb.datamodel.PropertySomeValueSnak( 'p42' ),
			new wb.datamodel.PropertySomeValueSnak( 'p42' ), // two times 42!
			new wb.datamodel.PropertyValueSnak( 'p42', new dv.StringValue( '~=[,,_,,]:3' ) )
		],
		[
			new wb.datamodel.PropertyValueSnak( 'p1', new dv.StringValue( 'a' ) ),
			new wb.datamodel.PropertyValueSnak( 'p1', new dv.StringValue( 'b' ) ),
			new wb.datamodel.PropertyValueSnak( 'p2', new dv.StringValue( 'c' ) ),
			new wb.datamodel.PropertyValueSnak( 'p2', new dv.StringValue( 'd' ) ),
			new wb.datamodel.PropertyValueSnak( 'p2', new dv.StringValue( 'e' ) ),
			new wb.datamodel.PropertyValueSnak( 'p3', new dv.StringValue( 'f' ) ),
			new wb.datamodel.PropertyValueSnak( 'p4', new dv.StringValue( 'g' ) )
		]
	];
	var anotherSnak = new wb.datamodel.PropertySomeValueSnak( 'p1' ),
		anotherSnak2 = new wb.datamodel.PropertySomeValueSnak( 'p2' );

	/**
	 * Returns the concatenated string values of a snak list's snaks.
	 *
	 * @param {wikibase.SnakList} snakList
	 * @return {string}
	 */
	function snakOrder( snakList ) {
		var snakValues = [];

		snakList.each( function( i, snak ) {
			snakValues.push( snak.getValue().getValue() );
		} );

		return snakValues.join( '' );
	}

	QUnit.test( 'SnakList constructor', function( assert ) {
		var snaks = snakSets[0];

		var constructorArgs = [
			[ snaks[0], 1, 'single wb.datamodel.Snak' ],
			[ snaks, 3, 'array of wb.datamodel.Snak' ],
			[ undefined, 0, 'undefined' ],
			[ new wb.datamodel.SnakList( snaks ), 3, 'wb.datamodel.SnakList' ]
		];

		for( var i = 0; i < constructorArgs.length; i++ ) {
			var args = constructorArgs[i],
				newSnakList = new wb.datamodel.SnakList( args[0] );

			assert.ok(
				newSnakList instanceof wb.datamodel.SnakList,
				'Test set #' + i + ': Instance of wb.datamodel.SnakList created with ' + args[2]
					+ '.'
			);

			assert.ok(
				newSnakList.length === args[1],
				'Test set #' + i + ': Length of Snak list is accurate (' + args[1] + ' Snaks).'
			);

			var equalNewSnakList = new wb.datamodel.SnakList( args[0] );
			assert.ok(
				newSnakList.equals( equalNewSnakList ) && equalNewSnakList.equals( newSnakList ),
				'Test set #' + i + ': Another instance of SnakList, created with same constructor '
					+ 'arguments, is being considered equal to the first list.'
			);

			var newListArray = newSnakList.toArray();
			assert.ok(
				$.isArray( newListArray ) && newListArray.length === newSnakList.length,
				'Test set #' + i + ': SnakList\'s toArray() returns simple Array with same length '
					+ 'as list.'
			);
		}

		assert.throws(
			function() {
				return new wb.datamodel.SnakList( 'foo' );
			},
			'Can not create SnakList with strange constructor argument'
		);
	} );

	QUnit.test( 'SnakList list operations', function( assert ) {
		var snaks = snakSets[0],
			newSnakList = new wb.datamodel.SnakList( snaks ),
			initialLength = newSnakList.length;

		assert.ok(
			!newSnakList.equals( new wb.datamodel.SnakList() )
				&& !( new wb.datamodel.SnakList() ).equals( newSnakList ),
			'Snak list is not equal to a new, empty Snak list'
		);

		assert.ok(
			newSnakList.hasSnak( snaks[0] ),
			'New Snak list recognizes a Snak from constructor array as one of its own'
		);

		assert.ok(
			!newSnakList.hasSnak( anotherSnak ),
			'New Snak list does not recognize another Snak, not in the list as one of its own'
		);

		assert.deepEqual(
			newSnakList.getPropertyOrder(),
			['p9001', 'p42'],
			'Verified property order.'
		);

		assert.ok(
			newSnakList.addSnak( anotherSnak ) && newSnakList.length === initialLength + 1,
			'Another snak added, length attribute increased by one'
		);

		assert.ok(
			newSnakList.hasSnak( anotherSnak ),
			'Newly added Snak recognized as one of the list\'s own Snaks now'
		);

		assert.deepEqual(
			newSnakList.getPropertyOrder(),
			['p9001', 'p42', 'p1'],
			'Verified property order.'
		);

		var clonedSnak = new anotherSnak.constructor(
			anotherSnak.getPropertyId(),
			$.isFunction( anotherSnak.getValue ) ? anotherSnak.getValue() : undefined
		);

		assert.ok(
			newSnakList.hasSnak( clonedSnak ),
			'Snak same as newly added Snak recognized as one of the list\'s own Snaks now'
		);

		assert.ok(
			!newSnakList.addSnak( clonedSnak ) && newSnakList.length === initialLength + 1,
			'Try to add snak equal to last one, length did not increase again, Snak not added'
		);

		assert.ok(
			newSnakList.addSnak( anotherSnak2 ) && newSnakList.length === initialLength + 2,
			'Added another Snak. Basically for upcoming test to check whether indexes won\'t be' +
				'mixed up since we could have created a gap in the internal organization of the list'
		);

		assert.ok(
			newSnakList.removeSnak( clonedSnak ) && newSnakList.length === initialLength + 1,
			'Newly added Snak removed again (identified by cloned Snak, so we test for non === ' +
				'case; list length decreased by one'
		);

		assert.deepEqual(
			newSnakList.getPropertyOrder(),
			['p9001', 'p42', 'p2'],
			'Verified property order.'
		);

		var i = 0;
		newSnakList.each( function( index, snak ) {
			assert.equal(
				index,
				i++,
				'Given index in wb.datamodel.SnakList.each() callback not incremented by more than one'
			);
			assert.ok(
				newSnakList.hasSnak( snak ),
				'Given wb.datamodel.Snak in wb.datamodel.SnakList.each() callback actually is member of related list'
			);
		} );

		assert.equal(
			i,
			newSnakList.length,
			'wb.datamodel.SnakList.each() did iterate over all Snaks in the list'
		);

		var newListArray = newSnakList.toArray();
		newListArray.push( 'foo' );
		assert.ok(
			newSnakList.length === newListArray.length - 1,
			'Array returned by toArray() is not a reference to List\'s internal Snak array'
		);

		assert.throws(
			function() {
				newSnakList.addSnak( 'foo' );
			},
			'Can not add some strange thing to the Snak list'
		);
	} );

	QUnit.test( 'getFilteredSnakList()', function( assert ) {
		var snaks = snakSets[1],
			snakList = new wb.datamodel.SnakList();

		assert.ok(
			snakList.getFilteredSnakList() instanceof wb.datamodel.SnakList,
			'Returned SnakList object when issuing getFilteredSnakList without parameter.'
		);

		assert.equal(
			snakList.getFilteredSnakList( 'p42' ).length,
			0,
			'No filtered snak list returned for an empty snak list.'
		);

		snakList = new wb.datamodel.SnakList( snaks );

		assert.ok(
			snakList.getFilteredSnakList().equals( snakList ),
			'Returning SnakList clone when issuing getFilteredSnakList without parameter.'
		);

		/**
		 * Indexed by property id, this object references the index of snaks belonging to the
		 * property group as to the array used as source for this test's SnakList object.
		 * @type {Object}
		 */
		var snakListGroups = {
			p1: [0, 1],
			p2: [2, 3, 4],
			p3: [5],
			p4: [6]
		};

		/**
		 * SnakList object containing the snaks grouped by property as to the snakListGroups
		 * variable specified above.
		 * @type {wikibase.SnakList}
		 */
		var groupedSnakList;

		for( var propertyId in snakListGroups ) {
			groupedSnakList = new wb.datamodel.SnakList();

			for( var i = 0; i < snakListGroups[propertyId].length; i++ ) {
				groupedSnakList.addSnak( snaks[snakListGroups[propertyId][i]] );
			}

			assert.ok(
				snakList.getFilteredSnakList( propertyId ).equals( groupedSnakList ),
				'Verified result of getFilteredSnakList() (property id: ' + propertyId + ').'
			);
		}
	} );

	QUnit.test( 'add()', function( assert ) {
		var snaks = snakSets[1],
			snakList = new wb.datamodel.SnakList();

		snakList.add( new wb.datamodel.SnakList() );

		assert.equal(
			snakList.length,
			0,
			'Nothing changed when adding an empty snak list to an empty snak list.'
		);

		snakList.add( new wb.datamodel.SnakList( snaks ) );

		assert.ok(
			snakList.equals( new wb.datamodel.SnakList( snaks ) ),
			'Added snak list to existing snak list.'
		);

		snakList.add( new wb.datamodel.SnakList() );

		assert.ok(
			snakList.equals( new wb.datamodel.SnakList( snaks ) ),
			'Nothing changed when adding an empty snak list.'
		);

		snakList.add( new wb.datamodel.SnakList( [ anotherSnak ] ) );

		var extendedSnakList = new wb.datamodel.SnakList( snaks );
		extendedSnakList.addSnak( anotherSnak );

		assert.ok(
			snakList.equals( extendedSnakList ),
			'Added another snak list.'
		);
	} );

	QUnit.test( 'getValidMoveIndices()', function( assert ) {
		var snaks = snakSets[1];

		/**
		 * Expected indices where the individual snaks (with or without its groups) may be moved to.
		 * @type {number[][]}
		 */
		var validIndices = [
			[1, 5, 6, 7],
			[0, 5, 6, 7],
			[0, 3, 4, 6, 7],
			[0, 2, 4, 6, 7],
			[0, 2, 3, 6, 7],
			[0, 2, 7],
			[0, 2, 5]
		];

		var snakList = new wb.datamodel.SnakList( snaks );

		for( var i = 0; i < validIndices.length; i++ ) {
			assert.deepEqual(
				snakList.getValidMoveIndices( snaks[i] ),
				validIndices[i],
				'Verified indices example snak #' + i + ' may be moved to.'
			);
		}

		snakList = new wb.datamodel.SnakList(
			[ new wb.datamodel.PropertyValueSnak( 'p1',  new dv.StringValue( 'a' ) ) ]
		);

		assert.strictEqual(
			snakList.getValidMoveIndices( snakList._snaks[0] ).length,
			0,
			'No indices returned when snak list does not contain more than one snak.'
		);

	} );

	QUnit.test( 'move()', function( assert ) {
		var snaks = snakSets[1],
			snakList;

		/**
		 * Array of test case definitions. Test case definition structure:
		 * [0] => Index of element to move
		 * [1] => Index where to move element
		 * [2] => Expected result when concatenating the string values of the snak list's snaks.
		 * @type {*[][]}
		 */
		var testCases = [
			[ 0, 1, 'bacdefg' ],
			[ 0, 5, 'cdeabfg' ],
			[ 0, 6, 'cdefabg' ],
			[ 0, 7, 'cdefgab' ],
			[ 1, 0, 'bacdefg' ],
			[ 1, 5, 'cdeabfg' ],
			[ 1, 6, 'cdefabg' ],
			[ 1, 7, 'cdefgab' ],
			[ 2, 0, 'cdeabfg' ],
			[ 2, 3, 'abdcefg' ],
			[ 2, 4, 'abdecfg' ],
			[ 2, 6, 'abfcdeg' ],
			[ 2, 7, 'abfgcde' ],
			[ 3, 0, 'cdeabfg' ],
			[ 3, 2, 'abdcefg' ],
			[ 3, 4, 'abcedfg' ],
			[ 3, 6, 'abfcdeg' ],
			[ 3, 7, 'abfgcde' ],
			[ 4, 0, 'cdeabfg' ],
			[ 4, 2, 'abecdfg' ],
			[ 4, 3, 'abcedfg' ],
			[ 4, 6, 'abfcdeg' ],
			[ 4, 7, 'abfgcde' ],
			[ 5, 0, 'fabcdeg' ],
			[ 5, 2, 'abfcdeg' ],
			[ 5, 7, 'abcdegf' ],
			[ 6, 0, 'gabcdef' ],
			[ 6, 2, 'abgcdef' ],
			[ 6, 5, 'abcdegf' ]
		];

		for( var i = 0; i < testCases.length; i++ ) {
			snakList = new wb.datamodel.SnakList( snaks );

			snakList.move( snaks[testCases[i][0]], testCases[i][1] );

			assert.equal(
				snakOrder( snakList ),
				testCases[i][2],
				'Verified moving a snak with test set #' + i + '.'
			);
		}

		snakList = new wb.datamodel.SnakList( snaks );
		snakList.move( snaks[0], 0 );

		assert.equal(
			snakOrder( snakList ),
			'abcdefg',
			'Nothing changed when trying to move a snak to an index it already has.'
		);

		assert.throws(
			function() {
				snakList = new wb.datamodel.SnakList( snaks );
				snakList.move( 0, 4 );
			},
			'move() throws an error when trying to move a snak to an invalid index.'
		);
	} );

	QUnit.test( 'moveUp() and moveDown()', function( assert ) {
		var snaks = snakSets[1],
			snakList;

		/**
		 * Array of test case definitions for moveUp() and moveDown() methods. Test case definition
		 * structure:
		 * [0] => Resulting order after moving the element having the same index in the snak list up.
		 * [1] => Resulting order after moving the element having the same index in the snak list down.
		 * @type {string[][]}
		 */
		var testCases = [
			['abcdefg', 'bacdefg' ],
			['bacdefg', 'cdeabfg' ],
			['cdeabfg', 'abdcefg' ],
			['abdcefg', 'abcedfg' ],
			['abcedfg', 'abfcdeg' ],
			['abfcdeg', 'abcdegf' ],
			['abcdegf', 'abcdefg' ]
		];

		for( var i = 0; i < testCases.length; i++ ) {
			snakList = new wb.datamodel.SnakList( snaks );

			assert.equal(
				snakOrder( snakList.moveUp( snaks[i] ) ),
				testCases[i][0],
				'Verified result of moveUp() with test set #' + i + '.'
			);

			snakList = new wb.datamodel.SnakList( snaks );

			assert.equal(
				snakOrder( snakList.moveDown( snaks[i] ) ),
				testCases[i][1],
				'Verified result of moveDown() with test set #' + i + '.'
			);

		}
	} );

}( wikibase, dataValues, jQuery, QUnit ) );
