const publicRoutes = {
  LOGIN: "/login",
};

const privateRoutes = {
  HOME: "/",
};

const Routes = Object.freeze({
  ...publicRoutes,
  ...privateRoutes,
});

export default Routes;
