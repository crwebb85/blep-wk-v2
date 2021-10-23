import * as cdk from 'monocdk';
import * as path from 'path';

import { AttributeType, Table } from 'monocdk/aws-dynamodb';
import { Effect, PolicyStatement } from 'monocdk/lib/aws-iam';

import { LambdaRestApi } from 'monocdk/lib/aws-apigateway';
import { NodejsFunction } from 'monocdk/lib/aws-lambda-nodejs';
import { Runtime } from 'monocdk/lib/aws-lambda';

export class BlepWkV2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      readCapacity: 1,
      writeCapacity: 1,
    });

    const apiLambda = new NodejsFunction(this, 'Lambda-API', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: 128,
      entry: path.join(__dirname, 'lambda/index.ts'),
      handler: 'handler',
      logRetention: 90,
      environment: { TABLE_NAME: table.tableName },
    });

    apiLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: ['dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:UpdateItem'],
      })
    );

    new LambdaRestApi(this, 'API-Main', {
      handler: apiLambda,
    });
  }
}
