<template>
  <div>
    <button @click="open = true" class="
        inline-flex
        items-center
        px-3
        py-2
        text-sm
        font-medium
        text-green-600
        hover:text-green-900
        bg-white
        rounded-md
        border
        border-gray-200
        hover:bg-gray-100
      ">
      <!-- Heroicon PlusCircle (Create Instruction) -->
      <PlusCircleIcon class="h-5 w-5 mr-1" />
      Create Receipt
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="open = false" static>
        <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-2 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <TransitionChild as="template" v-if="open" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <!-- Modal content -->
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

            <div
              class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="text-md font-medium leading-normal text-gray-800 mb-1" id="formModalLabel">
                  Create Receipt for Instruction (<b>ID: {{ props.rowId }} </b>)
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false">
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
              <form @submit.prevent="onSubmit" :validation-schema="CreateRequisitionSchema">

                <div class="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                  <div class="container mx-auto px-4 py-6">
                    <div class="flex gap-8"> <!-- Increased gap between panels -->
                      <!-- Left: Instructions Panel -->
                      <div class="flex-1 bg-white rounded-table p-4">
                        <h3 class="text-xl font-semibold mb-4">Dispatch Details</h3>
                        <p class="mb-4"><strong>DeliveryNote:</strong> {{ dispatch.DeliveryNote }}</p>
                        <p class="mb-4"><strong>FDP:</strong> {{ dispatch.FinalDestinationPoint }}</p>
                        <p class="mb-4"><strong>Truck Number:</strong> {{ dispatch.TruckNumber }}</p>
                        <p class="mb-4"><strong>Driver Name:</strong> {{ dispatch.DriverName }}</p>
                        <p class="mb-4"><strong>Driver License:</strong> {{ dispatch.DriverLicense }}</p>

                        <!-- Table for Goods List -->
                        <h3 class="text-lg font-semibold text-blue-500 mb-3">List of Goods Dispatched: </h3>
                        <div>
                          <table class="min-w-full bg-white border border-0 rounded-lg">
                            <thead class="bg-blue-100">
                              <tr>
                                <th class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">#</th>
                                <th class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Commodity</th>
                                <th class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Quantity</th>
                                <th class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Unit</th>
                                <th class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Receive</th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                              <tr v-for="(item, index) in  dispatch.dispatchedCommodities" :key="index" class="hover:bg-gray-100">
                                <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
                                <td class="py-2 px-4 border-b">{{ item.commodity.Name }}</td>
                                <td class="py-2 px-4 border-b">{{ item.Quantity }}</td>
                                <td class="py-2 px-4 border-b">{{ item.commodity.PackSize }} {{ item.commodity.Unit }}</td>
                                <td class="py-2 px-4 border-b">
                                  <input type="number" v-model.number="item.receivedQuantity" min="0" class=" w-20 p-1 border rounded border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" placeholder="Qty" />
                                  <button type="button" @click="receiveCommodity(item)" class="ml-2 px-2 py-1 bg-green-500 text-white rounded">Receive</button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                 
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                  <button @click="closeDialog"
                    class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                    Close
                  </button>
                  <button type="submit" style="background-color: #096eb4;"
                    class="px-4 py-2 mr-3 bg-blue-500 text-white rounded">Submit</button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>

import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon, PlusCircleIcon
} from "@heroicons/vue/solid";

import {
  Dialog,
  DialogOverlay,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateRequisitionSchema } from "../../../services/schema/requisition.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";

import { usedistrictstore } from "../../../stores/districts.store";

import { useDisasterstore } from "../../../stores/disaster.store";


import { useactivitiestore } from "../../../stores/activity.store";

import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";



import { userequisitionstore } from "../../../stores/requisition.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();

const $route = useRoute();
const showForm = ref(false);
const props = defineProps({
  rowId: {
    type: [String, Number],
    required: true
  },
  dispatch: Object,
  dispatchedCommodities: Array
});

const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

//FORM
const { meta } = useForm({
  validationSchema: CreateRequisitionSchema,
  initialValues: {
    Quantity: "",
    ExpiryDate: "",
    commodityId: "",
    warehouseId: "",
    userId: ""

  },
});
///FIELDS
const { value: DeliveryNote, errorMessage: DeliveryNoteError } =
  useField("DeliveryNote");
const { value: TruckNumber, errorMessage: TruckNumberError } = useField("TruckNumber")
const { value: FinalDestinationPoint, errorMessage: FinalDestinationPointError } = useField("FinalDestinationPoint");
const { value: DriverLicense, errorMessage: DriverLicenseError } = useField("DriverLicense");
const { value: DriverName, errorMessage: DriverNameError } = useField("DriverName");



//MOUNTED
onMounted(() => {
});
//FUNCTIONS




const currentDate = ref(moment().format('YYYY-MM-DD HH:mm:ss'));

const onSubmit = useSubmitForm((values, actions) => {

  emit("create", receivedCommodities);
  open.value = false;
  actions.resetForm();
});


const receivedCommodities = reactive([]);

const receiveCommodity = (item) => {
  if (item.receivedQuantity && item.receivedQuantity > 0) {
    receivedCommodities.push({
      commodityId: item.commodity.id,
      instructedReceiptId: props.rowId,
      Quantity: item.receivedQuantity,
    });
  }

}


</script>
