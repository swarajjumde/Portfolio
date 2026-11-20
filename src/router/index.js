import { profile } from '@/config/profile';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, saved) {
        if (saved) return saved;
        if (to.hash) return { el: to.hash, behavior: 'smooth' };
        return { top: 0 };
    },
    routes: [
        { path: '/', name: 'home', component: () => import('@/views/Home.vue'), meta: { title: '' } },
        { path: '/about', name: 'about', component: () => import('@/views/About.vue'), meta: { title: 'About' } },
        { path: '/projects', name: 'projects', component: () => import('@/views/Projects.vue'), meta: { title: 'Projects' } },
        { path: '/contact', name: 'contact', component: () => import('@/views/Contact.vue'), meta: { title: 'Contact' } },
        { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('@/views/NotFound.vue'), meta: { title: 'Not found' } }
    ]
});

router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} · ${profile.name}` : profile.name;
});

export default router;
