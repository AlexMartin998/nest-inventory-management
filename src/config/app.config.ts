export const EnvConfiguration = () => ({
  nodeEnv: process.env.NODE_ENV || 'dev',
  stage: process.env.STAGE || 'dev',

  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
});
