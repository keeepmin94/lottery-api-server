const _ = require("lodash");

class ResponseHandler {
  // 모든 처리 성공시 API response로 성공 반환
  static sendSuccess(res, message, status) {
    const funcName = "sendSuccess";

    //response에 받아온 data, globalData를 담는다.
    return (data, globalData) => {
      if (_.isUndefined(status)) status = 200;
      console.log(`[${funcName}] data:`, data);
      res.status(status).json({
        type: "success",
        message: message || "Success result",
        data,
        ...globalData,
      });
    };
  }

  // 서버측 에러가 아닌 API를 요청한 Client측의 잘못으로 에러난 경우 반환
  static sendClientError(status, req, res, errorMessage) {
    const funcName = "sendClientError";
    console.error(`[${funcName}]`, errorMessage);
    return res.status(status).json({
      type: "client_issue",
      message: errorMessage || "Client issue",
    });
  }

  //서버측 에버일 경우 반환
  static sendServerError(req, res, error) {
    const funcName = "sendServerError";
    console.error(`[${funcName}]`, error);
    return res.status(error.status || 500).json({
      type: "server_issue",
      message: error.message || "Server issue",
      error,
    });
  }
}

module.exports = ResponseHandler;
