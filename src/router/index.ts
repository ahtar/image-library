import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => {
            return import(/* webpackChunkName: "home" */ "../views/Home.vue")
        },
    },

    {
        path: "/collections/:name",
        name: "Collection",
        component: () => {
            return import(/* webpackChunkName: "collection" */ "../views/Collection.vue")
        }
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
