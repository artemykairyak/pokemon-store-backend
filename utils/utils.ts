export const sendOkResponse = (message?: string, result?: any) => {
  return {
    statusCode: 200,
    data: result,
    message,
  };
};
