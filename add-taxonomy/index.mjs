import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  console.log("Request Body is " + JSON.stringify(requestBody));
  const params = {
    TableName: "productTaxonomy",
    Item: {
      taxonomyId: requestBody.taxonomyId,
      name: requestBody.name,
      description: requestBody.description,
      parentId: requestBody.parentId,
      type: requestBody.type,
    },
  };

  try {
    await dynamoDB.put(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };

    return response;
  } catch (error) {
    console.error("Failed to create product Taxonomy", error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create product taxonomy" }),
    };

    return response;
  }
};
