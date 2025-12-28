
export const requestHandler = async (endPoint: string, token: string, secret: string) => {
  const controller = new AbortController();
  const url: string = `${secret}${endPoint}`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    signal: controller.signal
  });
  const response = request.json();

  return response;
}
