import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import AWS, { APIGateway } from 'aws-sdk';
import { UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { Clocker, generateUUIDClocker } from './util';

export const createClocker = async (event: APIGatewayProxyEventV2) => {
    try {
        const clocker: Clocker = JSON.parse(event.body);
        const clockerClient = new AWS.DynamoDB.DocumentClient();
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'clocker',
            Item: generateUUIDClocker(clocker),
        }
        const data = await clockerClient.put(params).promise();
        const header: Headers = new Headers();
        header.append('Content-Type', 'application/json; charset=utf-8');
        return {
            header: header,
            statusCode: 200,
            body: JSON.stringify({clocker: clocker})
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}

export const removeClocker = async (event: APIGatewayProxyEventV2) => {
    try {
        const clockerClient = new AWS.DynamoDB.DocumentClient();
        const id = event.pathParameters.id;
        console.log("id: ====>" + id);
        console.log(event.pathParameters);
        const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: 'clocker',
            Key: { id }
        }
        const data = await clockerClient.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Clocker with ID:" + id + "was removed succesfully.", data})
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}

export const listClocker = async () => {
    try {
        const clockerClient = new AWS.DynamoDB.DocumentClient();
        const params: AWS.DynamoDB.DocumentClient.ScanInput = {
            Limit: 10,
            TableName: 'clocker'
        }
        const data = await clockerClient.scan(params).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}

export const getClocker = async (event: APIGatewayProxyEventV2) => {
    try {
        const clockerClient = new AWS.DynamoDB.DocumentClient();
        const id = event.pathParameters.id;
        console.log("id: ====>" + id);
        console.log(event.pathParameters);
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: 'clocker',
            Key: { id }
        }
        const data = await clockerClient.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}

export const updateClocker = async (event: APIGatewayProxyEventV2) => {
    try {
        const clockerClient = new AWS.DynamoDB.DocumentClient();
        const id = event.pathParameters.id;
        
        const paramsToFiend: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: 'clocker',
            Key: { id }
        }
        const dataF = await clockerClient.get(paramsToFiend).promise();

        if (dataF && dataF.Item && dataF.Item.id) {
            const clockerUpdate: Clocker = JSON.parse(event.body);
            clockerUpdate.id = id;
            const paramsToUpdate: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
                TableName: 'clocker',
                Key: { 
                    id,
                },
                ReturnValues: "UPDATED_NEW",
                UpdateExpression: 'set firstname=:firstname, lastname=:lastname, email=:email, middleInitial=:middleInitial, gender=:gender, age=:age',
                ExpressionAttributeValues: {
                    ':firstname': clockerUpdate.firstname,
                    ':lastname': clockerUpdate.lastname,
                    ':email': clockerUpdate.email,
                    ':middleInitial': clockerUpdate.middleInitial,
                    ':gender': clockerUpdate.gender,
                    ':age': clockerUpdate.age
                }
            }
            let data = null;
            await clockerClient.update(paramsToUpdate, (err, d) => {
                if (err) {
                    console.log(err);
                    data = err;
                } else {
                    console.log(d);
                    data = d;
                }
            }).promise();
            
            return {
                statusCode: 200,
                body: JSON.stringify(data)
            }
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({message: "Item not found"})
            }
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}