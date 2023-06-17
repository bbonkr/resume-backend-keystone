const REVALIDATE_KEY = "x-revalidate-key";
const REVALIDATE_ENDPOINT = "/api/revalidate-resume";

const revalidateClientPage = async (url: string, key: string) => {
  if (!url || !key) {
    console.warn("[REVALIDATE] Url or key does not set");
  }

  let revalidateUrl = `${url}`;

  if (revalidateUrl.endsWith("/")) {
    revalidateUrl = `${revalidateUrl}${REVALIDATE_ENDPOINT}`;
  } else {
    revalidateUrl = `${revalidateUrl}/${REVALIDATE_ENDPOINT}`;
  }

  const response = await fetch(revalidateUrl, {
    method: "POST",
    headers: {
      [REVALIDATE_KEY]: key,
    },
  });

  const statusCode = response.status;

  if (200 > statusCode || statusCode >= 300) {
    console.warn("[REVALIDATE] Client page revalidating failed");
  }
};

export default revalidateClientPage;
