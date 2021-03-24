const google = require('googleapis').google;
const _auth = require('./Authorizer');
const datastore = google.datastore('v1');

exports.handler = function (event, callback) {

    datastore.projects.beginTransaction({
        projectId: process.env.GCP_PROJECT,
        resource: {
            transactionOptions: {
                readWrite: {}
            }
        }
    }).then(response => {
        datastore.projects.commit({
            projectId: process.env.GCP_PROJECT,
            resource: {
                mode: "TRANSACTIONAL",
                mutations: [
                    {
                        insert: {
                            key: {
                                path: {
                                    kind: "String",
                                    name: "hirutest"
                                }
                            },
                            properties: {
                                att01: { stringValue: "val01" }
                            }
                        }
                    }
                ],
                transaction: response.data.transaction
            }
        }).then(response => {
            console.log(response.data);           // successful response
            /*
            response.data = {
                "mutationResults": [
                    {
                        "version": "<version-timestamp-or-id>"
                    }
                ],
                "indexUpdates": 8,
                "commitVersion": "<commit-timestamp>"
            }
            */
        })
        .catch(err => {
            console.log(err, err.stack); // an error occurred
        });
    })
        .catch(err => {
            console.log(err, err.stack); // an error occurred
        });


    callback(null, { "message": "Successfully executed" });
}