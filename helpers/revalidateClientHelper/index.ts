const REVALIDATE_KEY = "x-revalidate-key";
const REVALIDATE_ENDPOINT = "api/revalidate-resume";

const revalidateClientPage = async (url: string, key: string) => {
  if (!url || !key) {
    console.warn("[REVALIDATE] Url or key does not set");

    return;
  }

  let revalidateUrl = `${url}`;

  if (revalidateUrl.endsWith("/")) {
    revalidateUrl = `${revalidateUrl}${REVALIDATE_ENDPOINT}`;
  } else {
    revalidateUrl = `${revalidateUrl}/${REVALIDATE_ENDPOINT}`;
  }

  console.info(
    `[REVALIDATE] Try to revalidate: url=${revalidateUrl};key=${
      key ? "********" : "Key is empty"
    }`
  );

  const response = await fetch(revalidateUrl, {
    method: "POST",
    headers: {
      [REVALIDATE_KEY]: key,
    },
  });

  const statusCode = response.status;

  const responseResult = await response.json();

  if (200 > statusCode || statusCode >= 300) {
    console.warn(
      "[REVALIDATE] Client page revalidating failed.",
      statusCode,
      responseResult
    );
  } else {
    console.info(
      "[REVALIDATE] Client page revalidating succeed.",
      responseResult
    );
  }
};

export default revalidateClientPage;
