import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  console.log("Request Body is " + JSON.stringify(requestBody));
  const params = {
    TableName: "products",
    Item: {
      productId: requestBody.productId,
      name: requestBody.name,
      description: requestBody.description,
      price: requestBody.price,
      category: requestBody.category,
      stock: requestBody.stock,
      createdAt: new Date().toLocaleString(),
      updatedAt: null,
    },
  };
  console.log("Hi Trying deploy here");
  try {
    await dynamoDB.put(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };

    return response;
  } catch (error) {
    console.error("Failed to create product", error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create product" }),
    };

    return response;
  }
};
