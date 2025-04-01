#!/bin/bash

# Define color codes
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
BLUE='\e[34m'
CYAN='\e[36m'
RESET='\e[0m' # Reset color

# Get AWS Account ID and Region dynamically
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
AWS_REGION=$(aws configure get region)

if [ -z "$AWS_ACCOUNT_ID" ] || [ -z "$AWS_REGION" ]; then
    echo -e "${RED}Error: Unable to fetch AWS account ID or region. Please ensure AWS CLI is configured.${RESET}"
    exit 1
fi

# Define your CDK stack name (change this to match your actual stack name)
STACK_NAME="InfraStack"

while true; do
    clear
    echo -e "${CYAN}============================"
    echo -e "     AWS CDK Helper Menu    "
    echo -e "============================${RESET}"
    echo -e "${BLUE}0)${RESET} npm run build  - ${YELLOW}Build the CDK project${RESET}"
    echo -e "${BLUE}1)${RESET} cdk bootstrap  - ${YELLOW}Bootstrap AWS environment${RESET}"
    echo -e "${BLUE}2)${RESET} cdk synth      - ${YELLOW}Synthesize the CloudFormation template${RESET}"
    echo -e "${BLUE}3)${RESET} cdk diff       - ${YELLOW}Compare deployed vs. local changes${RESET}"
    echo -e "${BLUE}4)${RESET} cdk deploy     - ${YELLOW}Deploy the CDK stack${RESET}"
    echo -e "${BLUE}5)${RESET} cdk list       - ${YELLOW}List all available stacks${RESET}"
    echo -e "${BLUE}6)${RESET} cdk doctor     - ${YELLOW}Check CDK environment setup${RESET}"
    echo -e "${BLUE}7)${RESET} cdk destroy    - ${YELLOW}Destroy the deployed stack${RESET}"
    echo -e "${BLUE}8)${RESET} Remove CDK Bootstrap (CDKToolkit)"
    echo -e "${RED}9) Exit${RESET}"

    read -p "Select an option (0-9): " choice

    case $choice in
    0)
        echo -e "${GREEN}Running npm run build...${RESET}"
        npm run build
        ;;
    1)
        echo -e "${GREEN}Running cdk bootstrap...${RESET}"
        cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION
        ;;
    2)
        echo -e "${GREEN}Running cdk synth...${RESET}"
        cdk synth
        ;;
    3)
        echo -e "${GREEN}Running cdk diff...${RESET}"
        cdk diff
        ;;
    4)
        echo -e "${YELLOW}Checking if CDK stack '${STACK_NAME}' is already deployed...${RESET}"
        STACK_STATUS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].StackStatus" --output text 2>/dev/null)

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}CDK stack '${STACK_NAME}' is already deployed with status: $STACK_STATUS${RESET}"
            echo -e "${YELLOW}Running CDK deploy to update the stack...${RESET}"
        else
            echo -e "${YELLOW}CDK stack '${STACK_NAME}' is not deployed. Deploying now...${RESET}"
        fi

        cdk deploy
        ;;
    5)
        echo -e "${GREEN}Running cdk list...${RESET}"
        cdk list
        ;;
    6)
        echo -e "${GREEN}Running cdk doctor...${RESET}"
        cdk doctor
        ;;
    7)
        echo -e "${RED}Running cdk destroy...${RESET}"
        cdk destroy
        ;;
    8)
        echo -e "${RED}Removing CDK bootstrap stack (CDKToolkit)...${RESET}"
        aws cloudformation delete-stack --stack-name CDKToolkit --region $AWS_REGION
        echo -e "${GREEN}CDKToolkit stack deletion initiated. Check AWS Console for progress.${RESET}"
        ;;
    9)
        echo -e "${RED}Exiting...${RESET}"
        exit 0
        ;;
    *) echo -e "${RED}Invalid option, please try again.${RESET}" ;;
    esac

    read -p "Press Enter to continue..."
done
