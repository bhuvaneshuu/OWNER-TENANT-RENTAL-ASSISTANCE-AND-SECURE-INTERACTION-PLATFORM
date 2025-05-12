import jwt from "jsonwebtoken";
import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import {
  ForbiddenRequestError,
  UnAuthorizedError,
} from "../request-errors/index.js";

const authorizeOwnerUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError("User is not Authorized (no or malformed token)");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_OWNER);
    const user = await OwnerUser.findById(payload.userId);
    if (!user) {
      throw new UnAuthorizedError("Owner user no longer exists");
    }
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    console.error("Owner token error:", error.message);
    throw new UnAuthorizedError("Access Token is not valid");
  }
};

const authorizeTenantUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError("User is not Authorized (no or malformed token)");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_TENANT);
    const user = await TenantUser.findById(payload.userId);
    if (!user) {
      throw new UnAuthorizedError("Tenant user no longer exists");
    }
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    console.error("Tenant token error:", error.message);
    throw new UnAuthorizedError("Access Token is not valid");
  }
};

export { authorizeOwnerUser, authorizeTenantUser };
