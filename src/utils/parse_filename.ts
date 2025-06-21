export default function parseFilename(filename: string) {
  const nameSplitArr = filename.split(".");
  const fileExtension = nameSplitArr[nameSplitArr.length - 1];
  const fileName = nameSplitArr.slice(0, nameSplitArr.length - 1).join(".");

  return { fileName, fileExtension };
}
