const express = require("express");
const { User } = require("../schema/User");

const router = express.Router();

// 회원가입
router.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

// 로그인
router.post("/api/users/login", (req, res) => {
  // 요청된 이메일 탐색
  User.findOne({ userID: req.body.userID }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "존재하지 않는 이메일입니다."
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다"
        });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        return res
          .cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id,
            email: user.email,
            name: user.name
          });
      });
    });
  });
});

// 모든 유저 데이터 조회
router.get("/api/users/all", function(req, res) {
  User.find(function(err, user) {
    if (err) return res.status(400).send(err);
    return res.status(200).json(user);
  });
});

// 알림 생성

module.exports = router;
