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

  data?.length !== 0 &&
    data?.map((element) => {
      damObjCount[element?.type?.toLowerCase()] =
        damObjCount[element?.type?.toLowerCase()] + 1;
      pricing[element?.type?.toLowerCase()]?.push(element.payment);
    });

  return { count: data?.length, damObjCount, pricing };
};
