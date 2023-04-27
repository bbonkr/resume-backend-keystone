const isProduction = (): boolean => {
  const PRODUCTION = "production";
  const nodeEnv = process.env.NODE_ENV ?? "development";
  return PRODUCTION === nodeEnv;
};

const getPort = (): number => {
  const port = parseInt(process.env.PORT ?? "3000", 10);
  return port;
};

const getMaxFileSize = (): number => {
  return 200 * 1024 * 1024;
};

const helpers = { isProduction, getPort, getMaxFileSize };

export default helpers;
