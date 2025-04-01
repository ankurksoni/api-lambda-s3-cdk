import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
// import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import { readFileSync } from 'fs';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // // S3 BUCKET
    // const balanceStatusBucket = new s3.Bucket(this, 'balanceStatusBucket', {
    //   bucketName: `balance-status-${this.account}-${this.region}`,
    //   versioned: true,
    //   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    //   publicReadAccess: false,
    //   autoDeleteObjects: true,
    //   removalPolicy: cdk.RemovalPolicy.DESTROY
    // });

    // // IAM ROLE
    // const balanceStatusRole = new iam.Role(this, 'balanceStatusRole', {
    //   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    //   roleName: `balanceStatusRole-${this.account}-${this.region}`,
    //   description: 'Role for Lambda to access S3 Bucket',
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
    //   ]
    // });

    // // LAMBDA FUNCTION
    // const balanceStatusFunction = new lambda.Function(this, 'balanceStatusLambdaFunction', {
    //   functionName: `balanceStatusLambdaFunction-${this.account}-${this.region}`,
    //   runtime: lambda.Runtime.NODEJS_22_X,
    //   handler: 'lambdaFunction.handler',
    //   code: lambda.Code.fromAsset('./services'),
    //   role: balanceStatusRole,
    // });

    // const bankingRESTAPI = new apiGateway.LambdaRestApi(this, 'bankingRESTAPI', {
    //   handler: balanceStatusFunction,
    //   restApiName: `bankingRESTAPI-${this.account}-${this.region}`,
    //   deploy: true,
    //   proxy: false,
    //   description: 'REST API for Banking',
    //   // defaultCorsPreflightOptions: {
    //   //   allowOrigins: ['*'],
    //   //   allowMethods: ['GET', 'POST', 'OPTIONS'],
    //   //   allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
    //   // },
    // });

    // const bankStatus = bankingRESTAPI.root.addResource('bankStatus');
    // bankStatus.addMethod('GET');

    // LESSON 2

    // // VPC and SUBNETS
    // const vpc = new cdk.aws_ec2.Vpc(this, 'myVpc', {
    //   vpcName: `myVpc-${this.account}-${this.region}`,
    //   ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    //   natGateways: 0,
    // });

    // // SECURITY GROUP
    // const securityGroup = new ec2.SecurityGroup(this, 'mySecurityGroup', {
    //   securityGroupName: `mySecurityGroup-${this.account}-${this.region}`,
    //   vpc,
    //   allowAllOutbound: true
    // });
    // securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic from anywhere');

    // let userDataScript: string;
    // try {
    //     userDataScript = readFileSync('./lib/userdata.sh', 'utf-8');
    // } catch (error) {
    //     console.error('Failed to read userdata script:', error);
        
    //     if (error instanceof Error) {
    //         if ('code' in error && error.code === 'ENOENT') {
    //             throw new Error('userdata.sh file not found. Please ensure the file exists in the lib directory.');
    //         }
    //         if ('code' in error && error.code === 'EACCES') {
    //             throw new Error('Permission denied while reading userdata.sh file.');
    //         }
    //     }
        
    //     throw new Error('Failed to load userdata script. Please check file permissions and path.');
    // }
    
    // if (!userDataScript || userDataScript.trim().length === 0) {
    //     throw new Error('userdata script cannot be empty');
    // }

    // const userData = ec2.UserData.forLinux();
    // userData.addCommands(userDataScript);

    // const demoEC2 = new ec2.Instance(this, 'demoEC2', {
    //   instanceName: `demoEC2-${this.account}-${this.region}`,
    //   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    //   machineImage: ec2.MachineImage.latestAmazonLinux({
    //       generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
    //   }),
    //   vpc,
    //   vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    //   securityGroup,
    //   keyName: 'demo_udemy',
    //   userData
    // });

    // LESSON 3

    const demoCICDPipeline = new CodePipeline(this, 'demoCICDPipeline', {
      pipelineName: `cdkPipeline-${this.account}-${this.region}`,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('ankurksoni/api-lambda-s3-cdk', 'master',
          {
            connectionArn: 'arn:aws:codeconnections:us-east-1:698926940450:connection/e2e09884-14b7-495a-8420-e8d2fb58a5b9',
          }
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    })
  }
}
