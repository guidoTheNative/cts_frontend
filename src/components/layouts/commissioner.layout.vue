<template>
  <div class="min-h-full font-body" style="background-color: #096eb4;">
    <!-- Horizontal Navigation Bar -->
    <nav aria-label="Sidebar" class="shadow-xl px-1 py-3 rounded-md" style="background-color: #096eb4;">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo and Admin Info -->
        <div class="flex items-center justify-between">
          <a href="#" class="bg-transparent rounded-md shadow-0 px-0 flex items-center">
            <img class="block" src="../../assets/images/images.png" alt="govt" style="height: 50px;" />
          </a>
          <a href="#" class="bg-transparent rounded-md shadow-0 px-0 flex items-center">
            <img class="block" src="../../assets/images/wfp-logo-emblem-white.png" alt="wfp" style="height: 50px;" />
          </a>
          <!-- Admin Text in the Middle -->
          <span class="font-bold text-white mx-4">DODMA CTS | Commissioner</span>
        </div>

        <div class="flex space-x-4">
          <!-- First Five Navigation Items -->
          <router-link v-for="item in firstFiveItems" :key="item.name" :to="item.href">
            <a :class="itemClasses(item)" :aria-current="item.current ? 'page' : undefined">
              <component :is="item.icon" :class="iconClasses(item)" aria-hidden="true" />
              {{ item.name }}
              <!-- Notification Bell for "Instructions" -->
              <div v-if="item.name === 'Instructions' && newInstructionsCount > 0" class="relative ml-2 mx-4">
                <span
                  class="absolute -top-3 -right-3 flex items-center justify-center px-1 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full"
                >
                  {{ newInstructionsCount }}
                </span>
              </div>
            </a>
          </router-link>

          <!-- Dropdown for Remaining Items -->
          <div v-if="remainingItems.length > 0" class="relative">
            <button @click="toggleDropdown" @mouseenter="toggleDropdown"
              class="text-gray-50 hover:text-gray-50 hover:bg-blue-400 px-2 py-2 text-xs font-medium rounded-md">
              More...
            </button>
            <div v-if="isDropdownOpen" @mouseleave="closeDropdown"
              class="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg">
              <router-link v-for="item in remainingItems" :key="item.name" :to="item.href"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative ml-5">
          <Menu as="div" class="flex-shrink-0 relative">
            <div>
              <MenuButton class="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
                <span class="sr-only">Open user menu</span>
                <span class="lowercase m-2 text-white">{{ user.username.replace(/\./g, ' ') }}</span>
                <span style="background-color: gray"
                  class="inline-flex items-center px-3 rounded-full text-sm font-medium text-white uppercase">
                  {{ user.username.match(/\b(\w)/g).join("") }}
                </span>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <a :href="item.href" :class="menuItemClasses(active, false)">
                    {{ item.name }}
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button @click="onSignout" :class="menuItemClasses(active, true)">Sign out</button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="py-4">
      <div class="max-w-3xl mx-auto sm:px-1 lg:max-w-7xl lg:px-1 lg:grid lg:grid-cols-12 lg:gap-5">
        <!-- Page Content -->
        <div class="lg:col-span-12 xl:col-span-12">
          <router-view />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-white text-center p-4" style="background-color: #096eb4;">
      <span class="inline-block align-middle text-sm">© 2024 Designed by WFP Malawi Supply Chain Unit</span>
    </footer>
  </div>
</template>

<script setup>
import { inject, ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems, TransitionChild, BellIcon } from "@headlessui/vue";
import { AdjustmentsIcon, HomeIcon } from "@heroicons/vue/outline";
import { useSessionStore } from "../../stores/session.store";
import { useinstructionstore } from "../../stores/instructions.store";

// Initialize variables
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const isDropdownOpen = ref(false);
const newInstructionsCount = ref(0);

const Swal = inject("Swal");
const $router = useRouter();
const instructionsStore = useinstructionstore();
const instructions = reactive([]);


onMounted(() => {
  getInstructions();
});

// Helper functions
const menuItemClasses = (active, isButton = false) => [
  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
  "block px-4 py-2 text-sm",
  isButton ? "w-full text-left" : "",
];
const iconClasses = (item) => [
  item.current ? "text-gray-500" : "text-white group-hover:text-white",
  "mr-1 flex-shrink-0 h-6 w-6",
];

const isLoading = ref(false)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const closeDropdown = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

const onSignout = async () => {
  try {
    await sessionStore.signOut();
    sessionStore.$reset();

    await $router.push({ path: "/portal/signin" }).then((res) => {
      if (res === undefined) {
        Swal.fire({
          text: "Securely signed out",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    });
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

const navigation = () => [
  { name: "Home", href: "/commissioner/dashboard", icon: HomeIcon, current: false },
  { name: "Instructions", href: "/commissioner/instruction-management", icon: AdjustmentsIcon, current: false },
  { name: "Reports", href: "/commissioner/report-management", current: false },
];

// Determine which navigation items are active
const navItems = computed(() => {
  const currentRouteBase = useRouter().currentRoute.value.fullPath.split("/").slice(0, 3).join("/");
  return navigation().map((item) => ({ ...item, current: currentRouteBase === item.href }));
});
const firstFiveItems = computed(() => navItems.value.slice(0, 5));
const remainingItems = computed(() => navItems.value.slice(5));

const itemClasses = (item) => [
  item.current ? 'bg-white text-black' : 'text-gray-50 hover:text-gray-50 hover:bg-blue-400',
  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
];



//FUNCTIONS
const getInstructions = async () => {
  isLoading.value = true;
  instructionsStore
    .get()
    .then((result) => {
      // Clear the existing array
      instructions.length = 0;

   

      // Push the filtered instructions into the array
      instructions.push(...result.filter(item => !item.IsApproved));


      // Update the count of new instructions
      newInstructionsCount.value = instructions.length;
    })
    .catch((error) => {
      Swal.fire({
        title: "User Retrieval Failed",
        text: "Failed to get instructions (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};



</script>
