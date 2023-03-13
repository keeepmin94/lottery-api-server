// routes/index.js 에 디폴트 API path를 routes/api 폴더(api/index.js)로 라우팅시키도록 설정

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/", require("./api")); // 항상 api 디렉토리로 라우터 설정

module.exports = router;
