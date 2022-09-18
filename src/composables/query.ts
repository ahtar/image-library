import { useRoute, useRouter, LocationQueryValue } from 'vue-router';

interface Query {
    [key: string]: string[] | string | LocationQueryValue[] | null;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    const route = useRoute();
    const router = useRouter();

    function getQuery(): Query {
        const query = route.query;
        const obj: Query = {};
        for (const a in query) {
            const t = query[a];
            if (typeof t == 'string') {
                const d = decodeURI(t).split('+');
                obj[a] = d;
            } else {
                obj[a] = t;
            }
        }

        return obj;
    }

    function setQuery(data: Query): void {
        const obj: Query = {};
        for (const a in data) {
            if (data[a] != null && data[a] != '') obj[a] = data[a];
        }

        router.replace({
            query: obj,
        });
    }

    function arrayToQuery(arr: Array<string>): string {
        let string = '';
        for (const item of arr) {
            string += '+' + item;
        }
        return string.replace('+', '');
    }

    return {
        router,
        route,
        getQuery,
        setQuery,
        arrayToQuery,
    };
}
