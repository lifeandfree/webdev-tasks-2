var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var multivarka = {
    server: function(url){
        this.query = {};
        if (url) {
            this.url = url;
            return this;
        }
        else{
            console.error('Error: server argument is not valid');
        }
    },
    collection: function(store){
        if (store) {
            this.store = store;
            return this;
        }
        else{
            console.error('Error: collection argument is not valid');
        }
    },
    where: function(field){
        if (field){
            this.field = field;
            return this;
        }
        else{
            console.error('Error:  argument is not valid')
        }
    },
    lessThan: function(quantity){
        this.query[this.field] = { $lt: quantity};
        return this;
    },
    greatThan: function(quantity){
        this.query[this.field] = { $gt: quantity};
        return this;
    },
    include: function(groups){
        if (this.isNot) {
            this.query[this.field] = {$nin: groups};
        }else{
            this.query[this.field] = {$in: groups};
        }
        return this;
    },
    not: function(){
        this.isNot = true;
        return this;
    },
    equal: function(value){
        if (this.isNot) {
            this.query[this.field] = {$ne: value};
        }else{
            this.query[this.field] = {$eq: value};
        }
        return this;
    },
    set: function(key, value){
        this.updated = { '$set': {}};
        this.updated['$set'][key] = value;
        return this;
    },
    insert: function(element, callback){
        var self = this;
        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            db.collection(self.store).insertOne(element, function(err, result) {
                assert.equal(err, null);
                console.log('Inserted a element into the ' + self.store + ' collection.');
                callback(err, result);
                db.close();
            });
        });
    },
    update: function(callback){
        var self = this;
        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            console.log(self.query)
            db.collection(self.store).updateMany(self.query, self.updated, function(err, result) {
                assert.equal(err, null);
                console.log('Updated a elements into the ' + self.store + ' collection.');
                callback(err, result);
                db.close();
            });
        });
    },
    remove: function(callback){
        var self = this;
        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            db.collection(self.store).deleteMany(self.query, function(err, result) {
                assert.equal(err, null);
                console.log('Deleted a element into the ' + self.store + ' collection.');
                callback(err, result);
                db.close();
            });
        });
    },
    find: function(callback){
        var self = this;
        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            var cursor =db.collection(self.store).find(self.query);
            cursor.toArray(function(err, result){
                assert.equal(err, null);
                callback(err, result);
                db.close();
            })
        });
    },
};

module.exports = multivarka;
