import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  console.log(requestBody);
  const productId = requestBody.productId;

  let updateExpression = "SET ";
  const expressionAttributeValues = {};

  Object.entries(requestBody).forEach(([key, value]) => {
    if (key !== "productId") {
      updateExpression += `${key} = :${key}, `;
      expressionAttributeValues[`:${key}`] = value;
    }
  });
  if (updateExpression && Object.keys(updateExpression).length) {
    expressionAttributeValues[":updatedAt"] = new Date().toLocaleString();
    updateExpression += `updatedAt= :updatedAt`;
  }
  // updateExpression = updateExpression.slice(0, -2);
  console.log(updateExpression);
  console.log(expressionAttributeValues);
  const params = {
    TableName: "products",
    Key: {
      productId: productId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const updatedProduct = await dynamoDB.update(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify(updatedProduct.Attributes),
    };

    return response;
  } catch (error) {
    console.error("Failed to update product", error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update product" }),
    };

    return response;
  }
};
