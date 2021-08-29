# Blep WaniKani

Track your WaniKani progress and defeat your enemies.

“If you know the enemy and know yourself, you need not fear the result of a hundred battles. If you know yourself but not the enemy, for every victory gained you will also suffer a defeat. If you know neither the enemy nor yourself, you will succumb in every battle.”
― Sun Tzu, The Art of War
## Tutorial  
See [this useful workshop](https://cdkworkshop.com/20-typescript.html) on working with the AWS CDK for Typescript projects.

Authorization Header:
` Secret {secret}`

## Deploying
Create a `.env` file in the root directory of the project with the following contents:
```
SECRET_WRITE_KEY=<some-secret-string>
```
Then run `yarn build && yarn deploy`.

## Useful commands

 * `yarn build`   compile typescript to js and create synth stack
 * `yarn watch`   watch for changes and compile
 * `yarn test`    perform the jest unit tests
 * `yarn cdk deploy`      deploy this stack to your default AWS account/region
 * `yarn cdk diff`        compare deployed stack with current state
 * `yarn cdk synth`       emits the synthesized CloudFormation template
