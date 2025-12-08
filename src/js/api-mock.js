export default function mockApi(response, error = false, delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(typeof error === "string" ? new Error(error) : error);
      } else {
        resolve(response);
      }
    }, delay);
  });
}