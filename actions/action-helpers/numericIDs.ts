export const numericIds = (userIds: FormDataEntryValue[]) => {
  const toString = userIds[0].toString();
  const splitted = toString.split(",");

  const ids: number[] = [];
  for (const id of splitted) {
    ids.push(+id);
  }
  return ids;
};
