import { useRoute, useRouter } from "vue-router";

interface Query {
  [key: string]: any;
}

export default function () {
  const route = useRoute();
  const router = useRouter();

  function getQuery() {
    const query = route.query;
    const obj: any = {};
    for (const a in query) {
      const t = query[a];
      if (typeof t == "string") {
        const d = decodeURI(t).split("+");
        obj[a] = d;
      } else {
        obj[a] = t;
      }
    }

    return obj;
  }

  function setQuery(data: Query) {
    const obj: any = {};
    for (const a in data) {
      if (data[a] != null && data[a] != "") obj[a] = data[a];
    }

    router.replace({
      query: obj,
    });
  }

  function arrayToQuery(arr: Array<string>) {
    let string = "";
    for (const item of arr) {
      string += "+" + item;
    }
    return string.replace("+", "");
  }

  return {
    router,
    route,
    getQuery,
    setQuery,
    arrayToQuery,
  };
}
