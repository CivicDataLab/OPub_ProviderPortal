export const accessModelMap = (data) => {
  let damObjCount = {
    restricted: 0,
    registered: 0,
    open: 0,
  };

  let pricing = {
    restricted: [],
    registered: [],
    open: ['open'],
  };

  data?.datasetaccessmodel_set?.length !== 0 &&
    data?.datasetaccessmodel_set?.map((element) => {
      damObjCount[element?.data_access_model?.type?.toLowerCase()] =
        damObjCount[element?.data_access_model?.type?.toLowerCase()] + 1;
      pricing[element?.data_access_model?.type?.toLowerCase()]?.push(
        element.payment
      );
    });

  return { count: data?.datasetaccessmodel_set?.length, damObjCount, pricing };
};
