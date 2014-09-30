# Wikibase DataModel JavaScript

**Wikibase DataModel JavaScript** is the JavaScript implementation of the
[Data Model](https://meta.wikimedia.org/wiki/Wikidata/Data_model)
at the heart of the [Wikibase software](http://wikiba.se/).

## Release notes

### 0.4 (dev)

#### Breaking changes
* Removed wikibase.datamodel.Reference.setSnaks(). Generate new Reference objects when interacting with the API to reflect hash changes performed in the back-end.
* Removed wikibase.datamodel.Entity.equals().
* Removed wikibase.datamodel.Reference.setSnaks().
* wikibase.datamodel.Reference constructor does not accept Snak object(s) any more.
* An entity cannot be constructed by passing internal object representation to Entity constructor anymore; Use entity specific constructors instead.
* Removed useless Entity.isNew(), Entity.newEmpty().
* Removed Entity.getLabel(), Entity.getLabels(), Entity.getDescription(), Entity.getDescription(), Entity.getAliases(), Entity.getAllAliases(); Acquire data via Entity.getFingerprint() instead.
* Removed Entity.getClaims(); Acquire claims/statements via Entity specific implementation.
* Item.getSiteLinks() returns a SiteLinkList object instead of an array of SiteLink objects.
* Renamed Property.getDataType() to Property.getDataTypeId().
* Removed all toJSON(), newFromJSON(), toMap() and newFromMap() functions; Use serializers and unserializers of wikibase.serialization instead.
* Statement does not accept a plain array of references anymore; Supply a ReferenceList instead.
* Remove Claim.TYPE and Statement.TYPE attributes.
* Instead of inheriting from Claim, Statement now features a Claim instance that needs to be passed to the Statement constructor.
* Reference constructor does not accept a plain list of Snak objects anymore; Supply a proper SnakList object instead.

#### Enhancements
* Added Fingerprint.
* Added ReferenceList.
* Added SiteLinkList.
* Added StatementList.
* Added Term.
* Added TermGroup.
* Added TermGroupList.
* Added TermList.
* Added individual constructors for Item and Property.
* Added Entity.getFingerprint(), Entity.setFingerprint().
* Added SiteLink and Statement specific functionality to Item.
* Added Statement specific functionality to Property.
* Added isEmpty() and equals() functions to Item and Property.

### 0.3.2 (2014-08-19)

* Added wikibase.datamodel.SiteLink.
* Added wikibase.datamodel.Item.getSiteLinks().

### 0.3.1 (2014-08-14)

* Remove ResourceLoader dependencies on jquery and mediawiki (bug 69468)

### 0.3.0 (2014-07-10)

* Remove methods isSameAs and equals from wikibase.Entity
* Move all classes from wikibase to wikibase.datamodel, e. g.
	wikibase.Claim becomes wikibase.datamodel.Claim

### 0.2.0 (2014-06-26)

* Let Entity.newFromMap expect a string instead of a DataType instance as
	datatype attribute when creating a Property.
* Let Property.getDataType return the data type's string identifier instead of
	a DataType instance.
* Fix regular expressions in resource loader definitions

### 0.1.0 (2014-06-18)

Initial release.
