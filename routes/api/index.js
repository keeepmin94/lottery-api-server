// routes/api/index.js에서는 성격에 따라 분리한 API base uri를 각각의 파일로 라우팅시키도록 설정

const router = require("express").Router();

router.use("/wallet", require("./wallet"));
router.use("/lottery", require("./lottery"));

module.exports = router;
