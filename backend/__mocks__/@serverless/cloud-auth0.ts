export function auth() {
  return function middleware(req, res, next) {
    req.token = {
      sub: "cloud-auth0-mock|123456789",
    };
    return next();
  };
}
