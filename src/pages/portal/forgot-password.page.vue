<template>
  <div class="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
    <div class="mx-auto w-full max-w-sm lg:w-96">
         <div>
      <div style="background-color: #096eb4;" class="flex justify-center items-center mb-4 rounded-md p-4" >
        <img class="h-24 mr-4" src="../../assets/images/images.png" alt="MW-Govt" />
        <img class="h-24" src="../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
      </div>
      <h2 class="mt-6 text-md font-extrabold text-gray-700 text-center">
        DoDMA Commodity Tracking System
        <span class="text-sm font-normal">(v2.0)</span>
      </h2>
    </div>
  </div>
    <div class="relative max-w-xl mx-auto">
      <svg
        class="absolute left-full transform translate-x-1/2"
        width="404"
        height="404"
        fill="none"
        viewBox="0 0 404 404"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="85737c0e-0916-41d7-917f-596dc7edfa27"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              class="text-gray-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width="404"
          height="404"
          fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
        />
      </svg>
      <svg
        class="absolute right-full bottom-0 transform -translate-x-1/2"
        width="404"
        height="404"
        fill="none"
        viewBox="0 0 404 404"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="85737c0e-0916-41d7-917f-596dc7edfa27"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              class="text-gray-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width="404"
          height="404"
          fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
        />
      </svg>

    
      <div class="text-center">
        <h2
          class="font-body text-3xl mt-3 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
        >
          Account recovery
        </h2>
        <p class="mt-4 text-lg leading-6 text-gray-500 font-body">
          Please contact system adminstrator to reset your password
        </p>
      </div>
      <div class="mt-12">
        <div class="mt-6 text-center">
          <router-link :to="{ name: 'portal-signin' }">
            <a class="text-base font-medium text-blue-400 hover:text-gray-500 font-body"
              >Go back to sign in page<span aria-hidden="true"> &rarr;</span></a
            >
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Switch } from "@headlessui/vue";

export default {
  components: {
    Switch,
  },
  setup() {
    const agreed = ref(false);

    return {
      agreed,
    };
  },
};
</script>
