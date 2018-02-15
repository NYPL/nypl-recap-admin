# NYPL ReCAP Admin UI
## Version
> 0.0.1

## Installation
Install all NPM dependencies listed under `package.json`
```sh
$ npm install
```

## OAuth Configuration
### Authorization
The app is configured to use `isso.nypl.org` for OAuth authentication. You will need to pass in the correct `CLIENT_SECRET` as an environment variable for the authentication to work correctly. You can look up the secret in the parameter store; the clientID is `platform_admin`. Set the environment variable `CLIENT_SECRET` to the client secret when running the app, as set out below.

#### Authentication
In order to use the SSO authentication your browser needs to talk to your app on an `nypl.org` address (as otherwise isso.nypl.org will not authenticate it — let's use `local.nypl.org` as an example) on port `80` (as isso.nypl.org will always redirect to port 80). To make `local.nypl.org` a local alias for your computer (on a Linux, Mac or other \*nix OS) you need to add the following line to your `/etc/hosts` file:

```
127.0.0.1	local.nypl.org
```

You only need to do that once (well, maybe again if you upgrade your OS — that _might_ update your `hosts` file).

In order to get your app to listen on port `80` you will need to make sure the following command is running whenever you run your node server:

```sh
$ sudo ssh -N -L 80:localhost:3001 `whoami`@localhost
```

Open up a new terminal window, run that command (you will be prompted for your password) and leave it running as you start up the application server, as described below.

## Running the Application

### Development Mode
We use Webpack to fire off a hot-reloading development server. This allows for continuous code changes without the need to refresh your browser.

```sh
$ CLIENT_SECRET=[CLIENT_SECRET] npm start // Starts localhost:3001 defaulting to the Development API
```

You can also set the `APP_ENV` variable which dictates what API environment to use as the main source.
```sh
$ APP_ENV=development|qa|production CLIENT_SECRET=[CLIENT_SECRET] npm start // Starts localhost:3001 with set APP_ENV
```

### Production Mode
To replicate the application in a production state. We execute 2 npm scripts with the proper `ENV` variables. By using `NODE_ENV=production`, we disable the hot-reload server. In addition, the `production` Webpack configuration by is set by running `npm run dist`.

* **Step 1**: Build the distribution assets into `./dist/`
```sh
$ npm run dist
```

* **Step 2**: Starts the Node/Express server in `localhost:3001` with the `APP_ENV` set to `production`, targeting the proper `production` API's.
```sh
$ APP_ENV=production CLIENT_SECRET=[CLIENT_SECRET] npm start:production
```

## SQS
### AWS Configuration
The AWS SQS Client needs the following `ENV` variables to successful post data to SQS:
* `AWS_SQS_API_URL`: SQS API url retrievable via the AWS console
* `AWS_REGION`: AWS region, default: `us-east-1`

### Payload Structure
The following is the current data payload for sending form submissions to SQS:
```
{
  "barcodes": [], <array of numerical 14 digit barcode strings>
  "userEmail": "foo@example.com", <string>
  "protectCGD": true || false, <boolean>
  "action": "refile || update || transfer",  <string>
  "bibRecordNumber": "b19192778x" <string> Only required on transfer, starts with the letter b followed by 8 numerical digits followed by one character which could be a numerical digit or the letter x
}
```

## GIT Workflow
We follow a [feature-branch](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) workflow. If you need to introduce/update the application code, you `SHOULD`:

* Create a new branch off the `development` branch
* Send a PR pointing to the `development` branch upon completion
* Once the PR is approved, it should be merged into the `development` branch
* If there are several PR's in process, a release should be scheduled by merging all completed PR's into the `development` branch
* When a release is to be deployed, the `development` branch will be merged into `master`
* All releases merged into `master` `MUST` be tagged and pushed to Github with their corresponding `version`

## AWS Elastic Beanstalk Application Settings
By using the `aws-cli`, developers can deploy the Homepage App to the desired AWS application environments listed below:

| AWS Profile | Application Name | Environment |
|---|---|---|
| `nypl-digital-dev` | `TBD` | **QA**: `TBD` <br><br> **Production**: `TBD` |
| `nypl-sandbox` | `nypl-recap-admin` | **Development**: `nypl-recap-admin-development` |

> Note: All QA and Development servers should be configured with only 1 instance. Production servers are typically setup with auto-scaling supporting 2 or more instances.

## AWS Deployment

#### QA/Development
Developers `SHOULD` target the proper environment when deploying the application for review. Using their proper profile credentials, developers will execute the `eb deploy` command to deploy a new version of the application on AWS.

#### Production
In our AWS production environment, we have defined a CI/CD pipeline via Travis CI to automatically:
* Run unit test coverage
* Run the npm task to build the distribution assets
* Execute the `deploy` hook only for `production` for AWS Elastic Beanstalk to deploy the new updates merged into `master`. This occurs only if a both `test` and `build` phases are successful
* Developers do not need to manually deploy the application unless an error occurred via Travis
