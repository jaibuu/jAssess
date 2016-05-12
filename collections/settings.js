Settings = new Mongo.Collection('Settings');

Settings.insert( {allowChanges: true} );

//Settings.update(Settings.findOne()._id, {$set: { allowChanges: true }})