import * as cdk from 'monocdk';
import { LambdaRestApi } from 'monocdk/lib/aws-apigateway';
import { Code, Runtime, Function } from 'monocdk/lib/aws-lambda';

export class BlepWkV2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiLambda = new Function(this, 'Lambda-API', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'index.handler',
    });

    new LambdaRestApi(this, 'API-Main', {
      handler: apiLambda,
    });
  }
}
