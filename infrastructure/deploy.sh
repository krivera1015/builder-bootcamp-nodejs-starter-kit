#!/usr/bin/env bash

set -e
set -u

# Configuration
CodeCommitRepoName=megamatrix-magic-kaan
StackName=megamatrix-magic-kaan
BucketName=megamatrix-magic-kaan-$USER

# Package and deploy
aws cloudformation package \
--template-file service.yaml \
--s3-bucket ${BucketName} \
--output-template-file packaged-${StackName}-template.yaml

aws cloudformation deploy \
--stack-name ${StackName} \
--template-file packaged-${StackName}-template.yaml \
--parameter-overrides \
"CodeCommitRepoName=${CodeCommitRepoName}" \
--s3-bucket ${BucketName} \
--capabilities CAPABILITY_IAM

# Display CodeCommit repository URL
aws codecommit get-repository --repository-name ${CodeCommitRepoName} \
--output text | awk '{print $4}'