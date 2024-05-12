<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate">
            Dashboard
          </h2>
        </div>
      </div>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-4">
          <!-- Welcome panel -->
          <section aria-labelledby="profile-overview-title">
            <div class="rounded-lg bg-white overflow-hidden shadow">
              <h2 class="sr-only" id="profile-overview-title">
                Profile Overview
              </h2>
              <div class="bg-white p-6  shadow-2xl">
                <div class="sm:flex sm:items-center sm:justify-between">
                  <div class="sm:flex sm:space-x-5">
                    <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                      <p class="text-md font-medium font-heading text-gray-600">
                        Welcome back,
                      </p>
                      <p class="text-xl font-bold text-gray-900 sm:text-2xl capitalize">

                        {{ user.username.replace(/\./g, ' ') }}


                      </p>
                      <p class="text-sm font-medium text-gray-600 md:text-1xl pt-2 uppercase">
                        {{ role.name }}
                      </p>
                    </div>
                  </div>


                  <div class="mt-1 flex justify-right gap-x-2 sm:mt-0">

                    <button @click="toggleView('dashboard')" type="button" style="background-color: #248cd6;"
                      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
                      :class="{ 'hidden': currentView === 'dashboard' }">
                      <TemplateIcon class="h-5 w-5 mr-2" />

                      Dashboard View
                    </button>

                    <button @click="toggleView('charts')" type="button" style="background-color: #248cd6;"
                      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
                      :class="{ 'hidden': currentView === 'charts' }">
                      <ChartBarIcon class="h-5 w-5 mr-2" />

                      Analysis View
                    </button>



                    <button @click="exportToExcel" v-if="!showCharts" style="background-color: #399dcd;"
                      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
                      :class="{ 'hidden': currentView === 'dashboard' }">
                      <DocumentDownloadIcon class="h-5 w-5 mr-2" /> <!-- Assuming DocumentDownloadIcon is available -->

                      Export to Excel
                    </button>

                    <button @click="takeScreenshot" v-if="!showCharts" style="background-color: #0f6c97;"
                      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
                      :class="{ 'hidden': currentView === 'dashboard' }">
                      <CameraIcon class="h-5 w-5 mr-2" /> <!-- Assuming CameraIcon is available -->
                      Take Screenshot
                    </button>

                  </div>
                </div>

              </div>

              <section ref="commodityTable">
                <!-- Chart and image container -->
                <div class="bg-gray-100 p-5" v-show="currentView === 'charts'">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Aligned images in the center -->
                    <div v-show="screenshotMode"
                      class="col-span-3 flex flex-col justify-center items-center bg-blue-500 text-white p-5">
                      <div class="flex justify-center items-center">
                        <img class="mr-4 h-20" src="../../../assets/images/images.png" alt="MW-Govt" />
                        <img class="h-20" src="../../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
                      </div>
                      <div class="text-center mt-4 ml-6">
                        <h1 class="text-lg font-bold">Commodity Tracking Dashboard</h1>
                      </div>
                    </div>

                    <!-- Instance of chart components -->
                    <div class="mx-4">
                      <distribution-by-commodity v-if="commodityDistributionData.length > 0" :commodityDistributionData="commodityDistributionData" />
                    </div>
                    <div class="mx-4">
                      <distribution-by-district  v-if="commodityDistributionData.length > 0" :commodityDistributionData="commodityDistributionData" />
                    </div>
                    <div class="mx-4">
                      <distribution-percentage  v-if="commodityDistributionData.length > 0" :commodityDistributionData="commodityDistributionData" />
                    </div>
                  </div>
                </div>

                <!-- Commodity distribution table view -->
                <div class="bg-gray-100 p-5" v-show="currentView === 'charts'">
                  <!-- New table component -->
                  <commodity-distribution-table :data="commodityDistributionData" :screenshotMode="screenshotMode" />
                  <!-- Other components for stats, etc... -->
                </div>
              </section>

              <div class="bg-gray-100 p-5" v-show="currentView === 'dashboard'">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">


                  <!-- Stats Cards -->
                  <div v-for="stat in stats" :key="stat.label"
                    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-semibold text-gray-800">{{ stat.value }}</span>
                        <component v-if="stat.label == 'Dispatch Status'"
                          :is="stat.progress >= 50 ? CheckCircleIcon : ExclamationCircleIcon"
                          :class="`h-6 w-6 text-${stat.progress >= 50 ? 'green-500' : 'red-500'}`" />
                        <component v-else :is="stat.icon" :class="`h-6 w-6 text-${stat.iconColor}`" />
                      </div>

                      <div class="text-sm font-medium text-gray-600 mt-2">{{ stat.label }}</div>
                    </div>
                    <div v-if="stat.percentageText" class="mt-4">

                      <div class="flex items-center justify-between">
                        <span :class="stat.progress >= 50 ? 'text-green-500' : 'text-red-500'">{{ stat.percentageText
                          }}</span>
                        <component :is="stat.progress >= 50 ? ArrowUpIcon : ArrowDownIcon" class="h-5 w-5"
                          :class="stat.progress >= 50 ? 'text-green-500' : 'text-red-500'" />
                      </div>


                      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div :class="stat.progress >= 50 ? 'bg-green-500' : 'bg-red-500'" class="h-2 rounded-full"
                          :style="{ width: stat.progress + '%' }">
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Actions panel -->
          <section aria-labelledby="quick-links-title" class="shadow-2xl bg-white rounded-table">
            <p class="text-center text-gray-600 mt-4 font-bold"> Recent Dispatches</p>

            <div class="align-middle inline-block min-w-full mt-1 rounded-table mx-0">
              <vue-good-table :columns="columns" :rows="dispaches" :search-options="{ enabled: true }"
                style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
                styleClass="vgt-table striped" compactMode>
                <!-- ... -->
              </vue-good-table>
            </div>
          </section>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs, computed, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../../../stores/session.store";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import "jspdf-autotable";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useUserStore } from "../../../stores/user.store";

import { useDispatcherStore } from "../../../stores/dispatch.store";
import ChartComponent from '../../../components/pages/charts/dashboardcharts.vue'; // Adjust path as needed
import distributionByCommodity from '../../../components/pages/charts/distributionByCommodity.vue'; // Adjust path as needed
import distributionByDistrict from '../../../components/pages/charts/distributionByDistrict.vue'; // Adjust path as needed
import distributionPercentage from '../../../components/pages/charts/distributionPercentage.vue'; // Adjust path as needed


import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";

import CommodityDistributionTable from './CommodityDistributionTable.vue';


import { useloadingplanstore } from "../../../stores/loadingplans.store";
import html2canvas from 'html2canvas';
import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import { useinstructionstore } from "../../../stores/instructions.store";

import { userequisitionstore } from "../../../stores/requisition.store";


import { usereceiptstore } from "../../../stores/receipt.store";

import createReportForm from "../../../components/pages/reports/create.component.vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  AcademicCapIcon,
  TemplateIcon, // Assuming this is for Dashboard
  ChartBarIcon, // Assuming this is for Charts
  BadgeCheckIcon,
  DocumentDownloadIcon, // or an alternative if this specific icon doesn't exist
  CameraIcon,
  BellIcon,
  CashIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
  TruckIcon,
  DocumentDuplicateIcon,
  CollectionIcon,
  IdentificationIcon,
  DocumentTextIcon,
  OfficeBuildingIcon,
  DocumentIcon, ClipboardListIcon, ExclamationCircleIcon, ExclamationIcon, ArrowUpIcon, ArrowDownIcon
} from "@heroicons/vue/outline";
import { SearchIcon } from "@heroicons/vue/solid";

const screenshotMode = ref(false);


// Example data structure for maize distribution
const commodityDistributionData = ref([]);


const currentView = ref('dashboard'); // The initial view can be 'dashboard' or 'charts'

const toggleView = (view) => {
  currentView.value = view;
};

const showTooltip = ref(false);

const res = reactive(['eee'])

const commodityTable = ref(null);

const takeScreenshot = () => {
  screenshotMode.value = true;

  // Use a timeout to delay the screenshot taking
  setTimeout(() => {
    if (commodityTable.value) {
      html2canvas(commodityTable.value.$el || commodityTable.value).then(canvas => {
        // Create an image from the canvas
        const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        // Create a link element, set the download attribute, and trigger a click to download
        const link = document.createElement('a');
        link.download = 'commodity-distribution.png';
        link.href = image;
        link.click();
        screenshotMode.value = false; // Hide screenshot specific content after taking the screenshot

      }).catch(error => {
        console.error('Error taking screenshot:', error);
      });
    }
  }, 300); // Delay in milliseconds, adjust as necessary
};

const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Origin Warehouse",
    field: row => row.instruction?.warehouse?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Destination District",
    field: row => row.instruction?.district?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Date Created",
    field: row => moment(row.instruction?.CreatedOn).format("DD/MM/yyyy"),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },



  /* 
  {
    label: "Options",
    field: row => row,
    sortable: false
  } */



]);



const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);


const instructionsStore = useinstructionstore();

const requisitionStore = userequisitionstore();


const recieptStore = usereceiptstore();
const receipts = reactive([]);

const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const userStore = useUserStore();

const dispatchStore = useInstructedDispatchesStore();

const catalogueStore = useListingStore();
const bookingStore = usebookingstore();

const bookings = reactive([]);
const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "", href: "#", current: true },
];

let catalogueCount = ref(0);

const users = reactive([]);

const dispaches = reactive([]);
const isLoading = ref(false);

const loadingPlanSummary = reactive([]);
let userCount = ref(0);

let bookingCount = ref(0);

const receiptcount = ref(0)

const dispatchcount = ref(0)
//MOUNTEDgetCatalogue
onMounted(async () => {
  try {
    const data = await requisitionStore.getCommodityDistributionSummary();
    commodityDistributionData.value = [...data];
  } catch (error) {
    console.error("Failed to load commodity data:", error);
  } finally {
    isLoading.value = false;
  }
  getCatalogue();
  getUsers();
  getBookings();
  getDispatches();
  getReceipts();
  getDispatchesCount();
  getLoadingPlansPending();
  getloadingplansSummary();
  getdispatchSummary();
  getloadingplansSummaryByCommodity();
  getInstructions()
 
});
//WATCH

const getCatalogue = async () => {
  catalogueStore.count().then((result) => {
    catalogueCount.value = result.count;
  });
};





const instructions = reactive([])
const newInstructionsCount = ref(0)

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

};


const getReceipts = async () => {
  recieptStore.count().then((result) => {
    receiptcount.value = result.count;
  });
};





// Export to Excel method
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(commodityDistributionData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Commodity Distribution');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, 'commoditydistributionreport.xlsx');
};


const getloadingplansSummaryByCommodity = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .getloadingplansSummaryByCommodity()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      loadingPlanSummary.length = 0;
      loadingPlanSummary.push(...result);

    })
}

const completedDispatch = ref(0)
const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      const sortedDispatches = [...result].sort((a, b) => {
        // Convert the `createdOn` field to a Date object and compare
        return new Date(b.createdon) - new Date(a.createdon);
      });

      // Clear the existing dispatches and push the sorted results
      dispaches.length = 0;
      let reversedData = sortedDispatches.reverse();
      dispaches.push(...reversedData);
      completedDispatch.value = dispaches.filter(item => item.IsArchived).length
    })
    .finally(() => {
      isLoading.value = false;
    });
}


const getDispatchesCount = async () => {
  dispatchStore.count().then((result) => {
    dispatchcount.value = result.count;
  });
}

const getLoadingPlans = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .get()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      const sortedDispatches = [...result].sort((a, b) => {
        // Convert the `createdOn` field to a Date object and compare
        return new Date(b.createdon) - new Date(a.createdon);
      });

      // Clear the existing dispatches and push the sorted results
      loadingplans.length = 0;
      loadingplans.push(...sortedDispatches);
    })
}

const pendingplans = ref(0)

const totalBalance = ref(0)

const totalStockPlanned = ref("")
const dispatchPercentageFormated = ref("")
const totalDispatched = ref("")
const totalReceived = ref("")
const receivedPercentageFormated = ref("")
const receivedPercentage = ref("")
const dispatchPercentage = ref("")

const getLoadingPlansPending = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .getloadingplansPending()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      pendingplans.value = result.count
    })
}


const getdispatchSummary = async () => {
  // isLoading.value = true;
  dispatchStore
    .getdispatchSummary()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field

      totalDispatched.value = result.totalDispatched.toLocaleString() + " MT"
      totalReceived.value = result.totalReceived
      receivedPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% received'

      receivedPercentage.value = result.dispatchPercentage.toFixed(2)
    })
}


const getloadingplansSummary = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .getloadingplansSummary()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field

      totalStockPlanned.value = result.totalStockPlanned.toLocaleString() + " MT"
      totalBalance.value = result.totalBalance
      dispatchPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% dispatched'
      dispatchPercentage.value = result.dispatchPercentage.toFixed(2)
    })
}

const getUsers = async () => {
  userStore.count().then((result) => {
    userCount.value = result.count;
  });

  userStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      users.length = 0; //empty array
      users.push(...result);

      users.sort((a, b) => new Date(b.created) - new Date(a.created));

    })


    .finally(() => {
      isLoading.value = false;
    });
};

const getBookings = async () => {
  bookingStore.count().then((result) => {
    bookingCount.value = result.count;
  });

  bookingStore.getbookingsClean().then((result) => {
    bookings.length = 0;
    bookings.push(...result);
  });
};


const createReport = async (model) => {
  isLoading.value = true;

  // Format the StartDate and EndDate using moment.js
  model.userId = user.value.id
  if (model.StartDate) {
    model.StartDate = moment(model.StartDate).toISOString();
  }
  if (model.EndDate) {
    model.EndDate = moment(model.EndDate).toISOString();
  }

  loadingPlanStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });

      $router.push('/admin/loadingplans'); // Use the router's push method to navigate

    })
    .catch(error => {
      // Handling error
    })
    .finally(() => {
      isLoading.value = false;
      getDispatches();
      getLoadingPlans();
    });
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Calculate the total required tonnage
const totalRequiredTonnage = computed(() => {
  const total = commodityDistributionData.value.reduce((sum, item) => sum + item.required, 0);
  return `${total.toLocaleString()} MT`; // Format number with thousand separator and add 'MT'
});

// Dummy data for stats
const stats = ref([
    {
    label: 'Total Required Tonnage',
    value: totalRequiredTonnage,
    icon: CheckCircleIcon,
    iconColor: 'green-500',
    percentageText: '',
    textColor: 'green-500',
    showProgress: false,
    moreInfo: true
  }
,

  {
    label: 'Requisitions Pending',
    value: newInstructionsCount,
    icon: DocumentIcon,
    iconColor: 'blue-400',
    percentageText: '',
    textColor: 'blue-600',
    showProgress: false
  }
  /* ,
   {
     label: 'Requisitions',
     value: 11,
     icon: ClipboardListIcon,
     iconColor: 'gray-400',
     percentageText: '',
     textColor: 'gray-600',
     showProgress: false
   }, */
]);
const actions = [
  {
    icon: IdentificationIcon,
    name: "Catalogue",
    href: "/admin/catalogue",
    iconForeground: "text-gray-500",
    iconBackground: "bg-gray-50",
    details: "Manage all service catalogue",
  },
  {
    icon: OfficeBuildingIcon,
    name: "Enquiries",
    href: "/admin/bookings",
    iconForeground: "text-gray-500",
    iconBackground: "bg-gray-50",
    details: "Manage all Enquiries made to services",
  },
];



const dispatchstatus = ref(0)


</script>
<style scoped>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is impor23tant to apply rounded corners to child elements */
}


.bg-blue-500 {
  background-color: #096eb4;
  /* Tailwind CSS color, replace with your project's color if not using Tailwind */
}

.h-20 {
  height: 80px;
  /* Adjust according to your needs */
}

.mr-4 {
  margin-right: 16px;
  /* Adjust according to your needs */
}

img.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>