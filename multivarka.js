var Promise = require('bluebird');
var MongoDB = Promise.promisifyAll(require('mongodb'));
var MongoClient = MongoDB.MongoClient;

var multivarka = {
    server: function(url){
        this.query = {};
        if (url) {
            this.url = url;
            return this;
        }
    },
    collection: function(store){
        if (store) {
            this.store = store;
            return this;
        }
    },
    where: function(field){
        if (field){
            this.field = field;
            return this;
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
        this.query[this.field] = (this.isNot) ? {$nin: groups} : {$in: groups};
        return this;
    },
    not: function(){
        this.isNot = true;
        return this;
    },
    equal: function(value){
        this.query[this.field] = (this.isNot) ? {$ne: value} : {$eq: value};
        return this;
    },
    set: function(key, value){
        this.updated = { '$set': {}};
        this.updated['$set'][key] = value;
        return this;
    },
    insert: function(element, callback){
        MongoClient.connect(this.url).then( db =>  {
            db.collection(this.store).insertOne(element).then( result => {
                console.log('Inserted a element into the ' + this.store + ' collection.');
                db.close();
                callback(null, result);
            }).catch(err => {
                db.close();
                callback(err);
            });;
        }).catch( err => {
            callback(err);
        });
    },
    update: function(callback){
        MongoClient.connect(this.url).then( db =>  {
            db.collection(this.store).updateMany(this.query, this.updated).then( result => {
                console.log('Updated a elements into the ' + this.store + ' collection.');
                db.close();
                callback(null, result);
            }).catch(err => {
                db.close();
                callback(err);
            });;
        }).catch( err => {
            callback(err);
        });
    },
    remove: function(callback){
        MongoClient.connect(this.url).then( db =>  {
            db.collection(this.store).deleteMany(this.query).then( result => {
                console.log('Deleted a element into the ' + this.store + ' collection.');
                db.close();
                callback(null, result);
            }).catch(err => {
                db.close();
                callback(err);
            });;
        }).catch( err => {
            callback(err);
        });
    },
    find: function(callback){
        MongoClient.connect(this.url).then( db =>  {
            db.collection(this.store).find(this.query).toArray().then( result => {
                callback(null, result);
                db.close();
            }).catch(err => {
                db.close();
                callback(err);
            });
        }).catch( err => {
            callback(err);
        });
    },
    request: function(req, callback){
        MongoClient.connect(this.url).then( db =>  {
            req.then( result => {
                callback(null, result);
                db.close();
            }).catch(err => {
                db.close();
                callback(err);
            });
        }).catch( err => {
            callback(err);
        });
    },
};

module.exports = multivarka;
