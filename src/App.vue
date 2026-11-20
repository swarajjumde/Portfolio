<script setup>
// App sirf router-view dikhata hai. Home fullscreen hero hai,
// baaki pages normal scroll wale.
</script>

<template>
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
    .fade-enter-active,
    .fade-leave-active {
        transition: none;
    }
}
</style>
