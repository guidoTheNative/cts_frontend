<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class=" md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="
              font-bold
              leading-7
              text-white
              sm:text-2xl sm:truncate
            ">
            Instructions
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-instructions' }">
            <button
              type="button"
              class="
                ml-3
                inline-flex
                items-center
                px-4
                py-2
                border border-transparent
                rounded
                shadow-sm
                text-sm
                font-medium
                text-white
                bg-blue-500
                hover:bg-blue-400
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-blue-500
                capitalize
              "
            >
              new user
            </button>
          </router-link> -->

        </div>
      </div>
      <!-- table  -->

      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="instructions" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>

          <template #table-row="props">
            <span v-if="props.column.label === 'Status'">
              <div>
                <span v-if="props.row.IsApproved"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Approved
                </span>
                <span v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  Not Approved
                </span>
              </div>
            </span>
            <span v-if="props.column.label == 'Options'">

              <div class="flex space-x-2">

                <!-- Create Instruction Button -->

                <create-instruction-dispatch-form :row-id="props.row.id" v-on:create="updateInstruction"
                  :instruction="props.row" :commodities="filteredCommodities(props.row.id)" :commodity="commodity" />


              </div>
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createInstructionDispatchForm from "../../../components/pages/instruction/instructionApproval.component.vue";


//SCHEMA//AND//STORES
import { useinstructionstore } from "../../../stores/instructions.store";
import { useSessionStore } from "../../../stores/session.store";

import { useInstructedCommoditiesStore } from "../../../stores/instructedCommodities.store";
import { usecommoditiestore } from "../../../stores/commodity.store";

import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import { useDispatchedCommoditiesStore } from "../../../stores/dispatchedCommodities.store";



const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");



//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dodma/dashboard", current: false },
  { name: "Instructions", href: "#", current: true }
];
const instructionsStore = useinstructionstore();
const instructions = reactive([]);


const InstructedDispatchesStore = useInstructedDispatchesStore();
const InstructedDispatches = reactive([]);

const DispatchedCommoditiesStore = useDispatchedCommoditiesStore();
const DispatchedCommodities = reactive([]);


const instructedCommodityStore = useInstructedCommoditiesStore();
const commodities = reactive([]);

const CommodityStore = usecommoditiestore();
const commodity = reactive([]);

const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Details",
    field: (row) => {
      // Combine the disaster and activity names with proper formatting
      const warehouseFormatted = `<span style="color: #096eb4;">From: ${row.warehouse.Name}</span>`;
      const districtFormatted = `<span style="color: green;">To: ${row.district.Name}</span>`;
      return `${warehouseFormatted}<br/>${districtFormatted}`;
    },
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
    html: true, // This is important to render HTML
    tdAttr: { "v-html": true } // Use v-html directive to render HTML
  },

  {
    label: "Transporter",
    field: row => row.transporter.Name,
    sortable: true,
    firstSortType: "asc"
  },
  {
    label: "District",
    hidden: false,
    field: row => row.district.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Status",
    hidden: false,
    field: row => row.IsApproved,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Options",
    field: row => row,
    sortable: false
  }
]);
//MOUNTED
onMounted(() => {
  getInstructions();
  getInstructedCommodities();
  getCommodity();
});

// Create dispatched commodities with the dispatch ID

const updateInstruction = async (newValues) => {
  isLoading.value = true;
  instructionsStore
    .update(newValues)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Successfully updated instruction",
        icon: "success",
      });
      
      getInstructions()
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to update instruction (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      getInstructions()
      isLoading.value = false;
    });
};


//FUNCTIONS
const getInstructions = async () => {
  isLoading.value = true;
  instructionsStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   instructions.push(...result);
      // }
      instructions.length = 0; //empty array
      instructions.push(...result.filter(item => !item.IsApproved));


    })
    .catch(error => {
      Swal.fire({
        title: "User Retrieval Failed",
        text: "failed to get instructions (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


//FUNCTIONS
const getCommodity = async () => {
  isLoading.value = true;
  CommodityStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   instructions.push(...result);
      // }
      commodity.length = 0; //empty array
      commodity.push(...result);


    })

};


const getInstructedCommodities = async () => {
  isLoading.value = true;
  instructedCommodityStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   instructions.push(...result);
      // }
      commodities.length = 0; //empty array
      commodities.push(...result);


    })

};

const filteredCommodities = (instructionID) => {
  return commodities.filter((item) => item.instructionId === instructionID);
};


</script>

<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>
