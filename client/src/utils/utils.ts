import filter from "lodash/filter";
import forEach from "lodash/forEach";
import DOMPurify from "dompurify";

class Utils {
  public refineHtml = (str: string) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = str;
    const anchors = newDiv.querySelectorAll("a");
    if (anchors) {
      forEach(anchors, (a) => {
        a.href = "#";
        a.innerHTML = "";
      });
    }
    return newDiv.innerHTML;
  };
  public sanitizedData = (data: string) => ({
    __html: this.refineHtml(DOMPurify.sanitize(data)),
  });
  public getStore = (scoreArr: [string, unknown][]) => {
    const score = filter(scoreArr, ([, value]) => value).length;
    return score;
  };
}

const utils = new Utils();
export default utils;
