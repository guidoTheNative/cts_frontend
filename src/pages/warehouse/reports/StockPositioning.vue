<template>
    <div class="w-full">

        <div class="flex justify-between items-centerrounded-md">
            <!-- Title on the left -->
            <span class="text-white font-bold">Warehouse Stock Positioning</span>

            <!-- Export Dropdown Button on the right -->
            <div class="relative inline-block text-left">
                <button @click.prevent="exportToExcel"
                    class="inline-flex justify-center rounded-md border p-3 border-none shadow-sm px-2 py-1 bg-blue-500 text-white text-md font-bold rounded-md hover:bg-blue-700 focus:outline-none"
                    id="menu-button" aria-expanded="true" aria-haspopup="true">
                    Export to Excel

                </button>

            </div>
        </div>

        <div class="overflow-x-auto relative bg-white p-6 rounded-lg shadow-lg mt-4">
            <div class="absolute top-0 right-0 p-4 flex items-center mb-8" :class="{ 'hidden': screenshotMode }">
                <!-- District Selector -->
                <span class="mr-3 font-medium mb-2">Warehouse:</span>
                <select v-model="selectedWarehouse"
                    class="mb-2 mr-2 focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option value="">All Warehouses</option>
                    <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.Name">
                        {{ warehouse.Name }}
                    </option>
                </select>

               <!--  <span class="mr-3 font-medium mb-2">District:</span>
                <select v-model="selectedDistrict"
                    class="mb-2 mr-2 focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option value="">All Districts</option>
                    <option v-for="district in districts" :key="district.id" :value="district.Name">
                        {{ district.Name }}
                    </option>
                </select> -->

                <!-- Commodity Selector -->
                <span class="mr-3 font-medium mb-2">Commodity:</span>
                <select v-model="selectedCommodity"
                    class="mb-2 focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option value="">All Commodities</option>
                    <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.Name">
                        {{ commodity.Name }}
                    </option>
                </select>

                <!-- Reset Button -->
                <button @click="resetFilters"
                    class="ml-2 mb-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded">
                    Reset Filters
                </button>






            </div>

            <table class="min-w-full divide-y divide-gray-200 mt-8">
                <thead class="bg-blue-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            District
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commodity
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Warehouse
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch
                            Number</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expiry
                            Date</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock
                            Available</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock
                            Pending Dispatch</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(row, index) in filteredData" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.district }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.commodity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.warehouse }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.batchNumber }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getBadgeClass(row.expiryDate)">
                                {{ row.expiryDate }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.stockAvailable }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.stockPendingDispatch }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="flex justify-center mt-4" :class="{ 'hidden': screenshotMode }">
                <button @click="prevPage" :disabled="currentPage <= 1"
                    class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
                    <ChevronLeftIcon class="w-5 h-5 mr-2" />
                    Prev
                </button>
                <span class="px-4 py-2 font-body font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage >= totalPages"
                    class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
                    <ChevronRightIcon class="w-5 h-5 mr-2" />
                    Next
                </button>

                <span class="mr-2 font-medium mt-2">Rows per page:</span>
                <select v-model="pageSize" class="border-gray-300 rounded-md">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
import moment from 'moment'; // Include moment.js for date calculations
import { usedistrictstore } from "../../../stores/districts.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useSessionStore } from "../../../stores/session.store";

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
const districtstore = usedistrictstore();
const commoditystore = usecommoditiestore();
const warehousestore = usewarehousestore();
const districts = reactive([]);
const commodities = reactive([]);
const warehouses = reactive([]);

const props = defineProps({
    data: Array,
    screenshotMode: Boolean,
});



const opendropdown = ref(false)
const currentPage = ref(1);
const pageSize = ref(5);
const selectedDistrict = ref('');
const selectedWarehouse = ref('');
const selectedCommodity = ref('');
const totalPages = computed(() => Math.ceil(props.data.length / pageSize.value));

const filteredData = computed(() => props.data.filter(item => {
    return (!selectedWarehouse.value || item.warehouse === selectedWarehouse.value) &&
        (!selectedCommodity.value || item.commodity === selectedCommodity.value);
}).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value));

function getBadgeClass(expiryDate) {
    const today = moment();
    const expiry = moment(expiryDate);
    const monthsDiff = expiry.diff(today, 'months', true);

    if (monthsDiff <= 1) {
        return 'bg-red-400 text-white px-2 py-1 rounded-full';
    } else if (monthsDiff <= 6) {
        return 'bg-yellow-400 text-white px-2 py-1 rounded-full';
    } else {
        return 'bg-green-400 text-white px-2 py-1 rounded-full';
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function resetFilters() {
    selectedDistrict.value = '';
    selectedWarehouse.value = '';
    selectedCommodity.value = '';
}





onMounted(() => {
    getCommodities();
    getDistricts();
    getWarehouses();
});


const getCommodities = async () => {
    let commoditydata = await commoditystore.get()
    commodities.length = 0
    commodities.push(...commoditydata)
    return commodities
}


const getWarehouses = async () => {
    let warehousedata = await warehousestore.get()
    warehouses.length = 0
    warehouses.push(...warehousedata.filter(item => item.district.Name == user.value.district))
    return warehouses
}

const getDistricts = async () => {
    let districtsdata = await districtstore.get()
    districts.length = 0
    districts.push(...districtsdata)
    return districts
}




const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(props.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Warehouse Stock Positoning');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'WarehouseStockPositoningReport.xlsx');
};

</script>