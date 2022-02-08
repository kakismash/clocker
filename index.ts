import { APIGatewayProxyEventPathParameters, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context } from 'aws-lambda';
import { createClocker, getClocker, removeClocker, listClocker, updateClocker } from './clocker.service';
export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context) => {
    if (event.requestContext.http.method.toLocaleLowerCase().includes('post')) {
        return createClocker(event);
    } else if (event.requestContext.http.method.toLocaleLowerCase().includes('delete') && event.pathParameters) {
        return removeClocker(event)
    } else if (event.requestContext.http.method.toLocaleLowerCase().includes('get') && event.pathParameters) {
        return getClocker(event);
    } else if (event.requestContext.http.method.toLocaleLowerCase().includes('get') && !event.pathParameters) {
        return listClocker();
    } else if (event.requestContext.http.method.toLocaleLowerCase().includes('put') && event.pathParameters) {
        return updateClocker(event);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: {event, context}
        })
    };
}