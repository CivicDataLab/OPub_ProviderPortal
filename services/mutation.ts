export const mutation = (
  mutationRequest,
  mutationResponse,
  mutationRequestVariable
) => {
  return new Promise<any>((resolve, reject) => {
    if (!mutationResponse.loading && !mutationResponse.error) {
      mutationRequest({
        variables: mutationRequestVariable,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          mutationResponse.reset();
          reject(err);
        });
    }
  });
};
