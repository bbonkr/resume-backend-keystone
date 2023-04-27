const getAllowdOrigins = () => {
  const allowOrigins = process.env.ALLOW_ORIGINS ?? "";

  const origins = allowOrigins?.split(";") ?? [];

  return origins;
};

export default getAllowdOrigins;
