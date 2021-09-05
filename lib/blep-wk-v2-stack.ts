import * as cdk from 'monocdk';
import { LambdaRestApi } from 'monocdk/lib/aws-apigateway';
import { Runtime } from 'monocdk/lib/aws-lambda';
import { NodejsFunction } from 'monocdk/lib/aws-lambda-nodejs';
import * as path from 'path';

export class BlepWkV2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiLambda = new NodejsFunction(this, 'Lambda-API', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: 128,
      entry: path.join(__dirname, '../lambda/index.ts'),
      handler: 'handler',
      logRetention: 90,
    });

    new LambdaRestApi(this, 'API-Main', {
      handler: apiLambda,
    });
  }
}
