import * as Knex from "knex";

exports.seed = function (knex: Knex): Promise<any> {    
    return Promise.resolve(
        knex("accounts").del()
        .then(function () {            
            return knex("accounts").insert([
            {id:1, owner:'Wesley Crusher',  address:'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ'},
            {id:2, owner:'Leonard McCoy',   address:'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp'},
            {id:3, owner:'Jonathan Archer', address:'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n'},
            {id:4, owner:'Jadzia Dax',      address:'2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo'},
            {id:5, owner:'Montgomery Scott',address:'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8'},
            {id:6, owner:'James T. Kirk',   address:'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM'},
            {id:7, owner:'Spock',           address:'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'}
            ]);
        })
    );
};
