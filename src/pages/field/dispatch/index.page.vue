<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Dispatches
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel">
          Export Data
        </button>
      </div>
      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">


        <vue-good-table :columns="columns" :rows="dispaches" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>

          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">

              <div class="flex space-x-2">

                <!-- Create Instruction Button -->
                <create-instruction-receipt-form :row-id="props.row.id" v-on:create="createReceipt"
                  :dispatch="props.row" />



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
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import createInstructionReceiptForm from "../../../components/pages/instruction/receipt.component.vue";


//SCHEMA//AND//STORES
import { useListingStore } from "../../../stores/catalogue.store";


import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Dispatches", href: "#", current: true },
];


import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import { useDispatchedCommoditiesStore } from "../../../stores/dispatchedCommodities.store";
import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";



const dispatchStore = useInstructedDispatchesStore();
const dispaches = reactive([]);


const dispatchedCommodityStore = useDispatchedCommoditiesStore();
const dispatchedCommodities = reactive([]);


const receivedCommodityStore = useReceivedCommoditiesStore();
const receivedCommodities = reactive([]);


import * as XLSX from 'xlsx';

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);


const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },


  {
    label: "Driver Name",
    hidden: false,
    field: row => `
    <span >${row.DriverName !== null ? row.DriverName : "-"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span >D.N: ${row.DeliveryNote}</span><br>` +
      `<span>FDP: ${row.FinalDestinationPoint !== null ? row.FinalDestinationPoint : "N/A"}</span><br>`
      +
      `<span>On: ${moment(row.Date).format("DD/MM/YYYY") !== null ? moment(row.Date).format("DD/MM/YYYY") : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },

  {
    label: "Dispatch Details",
    field: row => `
    <span class="from-color">Driver: ${row.DriverName || "Driver Not Specified"}</span><br>
    <span class="to-color">Truck: ${row.TruckNumber || "Not Available"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

  {
    label: "Options",
    field: row => row,
    sortable: false
  }


]);




const createReceipt = async (models) => {

  console.log(models, "dddddddddddddddddddd")
  if (!models || models.length === 0) {
    Swal.fire({
      title: "No Items",
      text: "No commodities available to receive.",
      icon: "info",
      confirmButtonText: "Ok"
    });
    return;
  }

  isLoading.value = true;

  try {
    // Process all receipt creations concurrently
    const promises = models.map(async (model) => {
      try {
        await receivedCommodityStore.create(model);
      } catch (error) {
        console.error(`Error receiving commodity with ID ${model.commodityId}:`, error);
      }
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    Swal.fire({
      title: "Success",
      text: "Received commodities successfully.",
      icon: "success",
      confirmButtonText: "Ok"
    });
  } catch (error) {
    Swal.fire({
      title: "Receipt Failed",
      text: `Failed to receive commodities due to an unexpected error: ${error}`,
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
};



const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Dispatches';

  // Assuming dispaches is an array of objects
  // Map over dispaches and exclude certain fields
  const dataForExport = dispaches.map(({ CreatedOn, UpdatedOn, DispatcherId, loadingPlanId, Dispatcher, loadingPlan, ...keepAttrs }) => keepAttrs);

  // Create a worksheet from the filtered data array
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'Dispatches.xlsx');
};


//MOUNTED
onMounted(() => {
  getDispatches();
  getDispatchedCommodities();
  // getLatest()
});
//FUNCTIONS



const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      dispaches.length = 0; //empty array
      let sorteddata = result.reverse()
      dispaches.push(...sorteddata);


    })


    .finally(() => {
      isLoading.value = false;
    });

}



const getDispatchedCommodities = async () => {
  isLoading.value = true;
  dispatchedCommodityStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      dispatchedCommodities.length = 0; //empty array
      let sorteddata = result.reverse()
      dispatchedCommodities.push(...sorteddata);


    })


    .finally(() => {
      isLoading.value = false;
    });

}



</script>

<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}


.from-color {
  color: #096eb4;
  /* or any color you prefer */
}

.to-color {
  color: green;
  /* or any color you prefer */
}

.by-color {
  color: gray;
  /* or any color you prefer */
}
</style>
