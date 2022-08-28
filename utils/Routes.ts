const publicRoutes = {
  LOGIN: "/login",
};

const privateRoutes = {
  HOME: "/",
  PROFILE: "/profile",
  FOLLOWING: "/following",
};

const Routes = Object.freeze({
  ...publicRoutes,
  ...privateRoutes,
});

export default Routes;
