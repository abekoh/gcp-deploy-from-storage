'use strict';
const {CloudBuildClient} = require('@google-cloud/cloudbuild');

exports.build = async file => {
    // file.metageneration: メタ情報が更新されるとインクリメントされる値
    // ファイル自体が更新されるときは'1'となる
    if (file.metageneration !== '1') {
        return;
    }
    // Promiseを返却することで、解決させてfunctionsが終了する
    return new CloudBuildClient().createBuild({
        projectId: process.env.GCP_PROJECT_ID,
        build: {
            source: {
                storageSource: {
                    bucket: file.bucket,
                    object: file.name
                }
            },
            steps: [
                {
                    "name": "gcr.io/cloud-builders/gcloud",
                    "args": [
                        "functions",
                        "deploy",
                        "hello-func",
                        "--entry-point=hello",
                        "--runtime=nodejs10",
                        "--memory=128MB",
                        "--region=us-central1",
                        "--trigger-http"
                    ]
                }
            ]
        }
    });
};
