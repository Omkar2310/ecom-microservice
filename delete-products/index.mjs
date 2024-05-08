import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: "products",
    Key: {
      productId: body.productId,
    },
  };
  console.log(params);
  try {
    await dynamoDB.delete(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Product deleted successfully" }),
    };

    return response;
  } catch (error) {
    console.error("Failed to delete product", error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete product" }),
    };

    return response;
  }
};
