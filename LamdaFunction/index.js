const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  try {
    const token = extractToken(event);
    if (!token) throw new Error("Token missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const route = event.routeKey || event.methodArn;
    const userRole = decoded.role;

    const method = route.split(' ')[0];

    if (method === "DELETE" && userRole !== "admin") {
      return generatePolicy("unauthorized", "Deny", event.methodArn);
    }

    if (method === "POST" && !["admin", "user"].includes(userRole)) {
      return generatePolicy("unauthorized", "Deny", event.methodArn);
    }

    return generatePolicy(decoded.username, "Allow", event.methodArn);

  } catch (err) {
    console.log("Auth error:", err.message);
    return generatePolicy("unauthorized", "Deny", event.methodArn);
  }
};

function extractToken(event) {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      role: principalId,
    }
  };
}