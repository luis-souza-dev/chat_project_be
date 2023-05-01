const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, RefreshToken } = require("../../db/models");

const authController = require("./auth");
const jwt_secret = "mockjwtsecret";

// Mocking the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Test suite for authController
describe("authController", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = jwt_secret;
  });
  describe("login", () => {
    it("should return 500 if no email provided", async () => {
      const req = {
        body: {
          pwd: "password",
        },
      };
      const res = mockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("no email provided");
    });

    it("should return 500 if no pwd provided", async () => {
      const req = {
        body: {
          email: "user@example.com",
        },
      };
      const res = mockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("no pwd provided");
    });

    it("should return 500 if invalid email", async () => {
      const req = {
        body: {
          email: "invalid@example.com",
          pwd: "password",
        },
      };
      const res = mockResponse();

      User.findOne = jest.fn().mockReturnValue(null);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          email: "invalid@example.com",
        },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Invalid email");
    });

    it("should return 500 if invalid password", async () => {
      const req = {
        body: {
          email: "user@example.com",
          pwd: "invalidpassword",
        },
      };
      const res = mockResponse();

      const user = {
        id: 1,
        email: "user@example.com",
        pwd: bcrypt.hashSync("password", bcrypt.genSaltSync(10)),
      };
      User.findOne = jest.fn().mockReturnValue(user);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Invalid Password");
    });

    it("should return 200 if valid credentials", async () => {
      const req = {
        body: {
          email: "user@example.com",
          pwd: "password",
        },
      };
      const res = mockResponse();

      const user = {
        id: 1,
        email: "user@example.com",
        pwd: bcrypt.hashSync("password", bcrypt.genSaltSync(10)),
        getRefreshToken: jest.fn().mockReturnValue(null),
      };
      User.findOne = jest.fn().mockReturnValue(user);

      const tokenData = {
        userId: 1,
        userEmail: "user@example.com",
      };
      const accessToken = jwt.sign(tokenData, jwt_secret, { expiresIn: "10s" });
      const refreshToken = jwt.sign({ userId: 1 }, jwt_secret, {
        expiresIn: "1d",
      });

      RefreshToken.create = jest
        .fn()
        .mockReturnValue({ setUser: jest.fn(), token: refreshToken });
      user.setRefreshToken = jest.fn();

      await authController.login(req, res);

      // expect(User.findOne).toHaveBeenCalledWith({
      //     where: {

      //     }
      // })
    });
  });

  describe("refresh", () => {
    let req;
    let res;
    let userRefreshToken;
    let user;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      userRefreshToken = { token: "refreshToken", update: jest.fn() };
      user = {
        id: 1,
        email: "user@test.com",
        getRefreshToken: jest.fn().mockResolvedValue(userRefreshToken),
      };
      User.findOne = jest.fn().mockResolvedValue(user);
      jwt.verify = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 500 if no token is provided", async () => {
      await authController.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Missing token");
    });

    it("should return 500 if token is invalid", async () => {
      jwt.verify.mockReturnValueOnce(false);
      req.body.token = "invalidToken";
      await authController.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Invalid Token");
    });

    it("should return 500 if user is not found", async () => {
      const object = { userId: 999 };
      req.body.token = jwt.sign(object, jwt_secret, { expiresIn: "1d" });
      jwt.verify.mockReturnValueOnce(object);
      User.findOne = jest.fn().mockReturnValueOnce(false);
      await authController.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("User not found");
    });

    it("should return 401 if token does not match user refresh token", async () => {
      jwt.verify.mockReturnValueOnce({ userId: 1 });
      req.body.token = "otherToken";
      await authController.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Token missmatch");
    });

    it("should return 401 if user refresh token is invalid", async () => {
      jwt.verify.mockReturnValueOnce({ userId: 1 });
      req.body.token = "refreshToken";
      jwt.verify.mockImplementationOnce((_, __, cb) => cb("Invalid Token"));
      await authController.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid Token");
    });

    it("should return 200 with new access and refresh tokens", async () => {
      jwt.verify.mockReturnValueOnce({ userId: 1 });
      req.body.token = "refreshToken";
      const accessToken = "newAccessToken";
      const refreshToken = "newRefreshToken";
      jwt.sign = jest.fn()
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);
      await authController.refresh(req, res);
      expect(userRefreshToken.update).toHaveBeenCalledWith({
        token: refreshToken,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ accessToken, refreshToken });
    });
  });
});
