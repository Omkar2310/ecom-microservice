import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    console.log(JSON.stringify(event));
    // Retrieve all products from the Products table
    let productsParams = {
      TableName: "products",
    };
    let products;
    if (event.body) {
      const body = JSON.parse(event.body);
      productsParams.Key = {
        productId: body.productId,
      };
      const product = await dynamoDB.get(productsParams).promise();
      products = product.Item ? product.Item : null;
    } else {
      const productsResult = await dynamoDB.scan(productsParams).promise();
      products = productsResult.Items;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(products),
    };

    return response;
  } catch (error) {
    console.log(error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to get product" }),
    };

    return response;
  }
};
