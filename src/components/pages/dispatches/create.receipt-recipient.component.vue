<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="closeDialog" static>
      <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="container mx-auto px-4 py-6">
                <!-- Flex container for the two main sections -->
                <div class="flex flex-nowrap">

                  <!-- Left Side: Form for Receipt Creation -->
                  <div class="flex-grow p-4 bg-white">
                    <h2 class="text-xl font-semibold mb-4 text-blue-400">Create a Receipt</h2>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="quantity" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Final Destination Point</label>
                      <input type="text" name="fdp" v-model="receipt.FinalDestinationPoint" id="DeliveryNote" autocomplete="FinalDestinationPoint" class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="NoBags" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Number of Bags</label>
                      <input type="number" name="NoBags" @keypress="validateNumberInput" v-model="receipt.NoBags" id="NoBags" autocomplete="NoBags" class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="Quantity" :class="quantityLabelClass" class="block text-sm font-bold text-gray-700 mb-2  mt-2">{{ quantityLabel }}</label>
                      <input type="number" name="Quantity" :value="computedTonnage" id="Quantity" autocomplete="Quantity" readonly class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="End Date" class="block text-sm font-bold text-gray-700 mb-2 mt-2">Date</label>
                      <input type="date" name="Date" v-model="receipt.Date" id="Date" autocomplete="Date" class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :max="new Date().toISOString().split('T')[0]" />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="Remarks" class="block text-sm font-bold text-gray-700 mb-2 mt-2">Remarks</label>
                      <div class="border-b">
                        <div class="space-y-2">
                          <div v-for="(remark, i) in remarksArray" :key="i" class="space-y-2">
                            <div class="flex items-center space-x-2">
                              <div class="col-span-6 sm:col-span-3">
                                <label class="block text-sm font-bold text-gray-700 mb-2 mt-2">Select Remark</label>
                                <select name="Remarks" v-model="remark.Remarks" id="Remarks" class="mt-2 block w-60 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                  <option value="">Select Remark</option>
                                  <option value="received in good condition">Received in good condition</option>
                                  <option value="received but damaged">Received but damaged</option>
                                  <option value="received but not expected quantity">Received but not at the expected quantity</option>
                                  <option value="other">Other (please specify)</option>
                                </select>
                              </div>
                              <div class="col-span-6 sm:col-span-3">
                                <label for="Quantity" :class="quantityLabelClass" class="block text-sm font-bold text-gray-700 mb-2 mt-2">{{ quantityLabel }}</label>
                                <input type="number" v-model.number="remark.quantity" min="0" placeholder="Qty Received" class="mt-2 block w-40 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                              </div>
                              <button @click="removeRemark(i)" class="ml-2 mt-6 inline-flex items-center p-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                <MinusCircleIcon class="h-5 w-5" />
                              </button>
                            </div>
                            <textarea v-if="remark.Remarks === 'other'" v-model="remark.Comments" id="CustomRemark" rows="3" class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="Enter your custom remark here"></textarea>
                          </div>
                        </div>
                        <button @click="addRemark(index)" type="button" class="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100">
                          <PlusCircleIcon class="h-5 w-5 mr-1" />
                          Add Remark
                        </button>
                      </div>
                    </div>

                    <div class="flex justify-end mt-4">
                      <button @click="resetReceipt()" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 active:bg-red-700 transition ease-in-out duration-150">
                        Reset
                      </button>
                      <button @click="submitReceipt()" class="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-400 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 active:bg-blue-400 transition ease-in-out duration-150">
                        Submit
                      </button>
                    </div>
                  </div>

                  <!-- Vertical divider line -->
                  <div class="hidden sm:block sm:w-px sm:bg-gray-200"></div>

                  <!-- Right Side: Loading Plan Details -->
                  <div class="flex-initial w-96 p-4 bg-white">
                    <h2 class="text-xl font-semibold mb-4 text-blue-400">Receipt Details - ID {{ dispatch.id }}</h2>
                    <!-- ... Loading Plan Details ... -->

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Created By: </span>
                      <span class="text-sm text-gray-600"> {{ dispatch.Dispatcher.username.replace(/\./g, ' ') }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Created On: </span>
                      <span class="text-sm text-gray-600"> {{ moment(dispatch.createdOn).format("DD/MM/YYYY") }}</span>
                    </div>
                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Delivery Note: </span>
                      <span class="text-sm text-gray-600"> {{ dispatch.DeliveryNote }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Final Destination: </span>
                      <span class="text-sm text-gray-600"> {{ dispatch.FinalDestinationPoint }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Quantity: </span>
                      <span class="text-sm text-gray-600"> {{ dispatch.Quantity }} MT</span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Dispatched On: </span>
                      <span class="text-sm text-gray-600"> {{ moment(dispatch.Date).format("DD/MM/YYYY") }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Driver: </span>
                      <span class="text-sm text-gray-600"> {{ dispatch.DriverName }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">License: </span>
                      <span class="text-sm text-gray-600"> {{ dispatch.DriverLicense }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:w-auto sm:text-sm" @click="closeDialog">
                Close
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogOverlay, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { useRouter } from "vue-router";
import { inject, ref, reactive, defineEmits, onMounted, watch, computed } from "vue";
import { usereceiptstore } from "../../../stores/receipt.store";
import { useSessionStore } from "../../../stores/session.store";
import { PlusCircleIcon, MinusCircleIcon, XIcon, CheckCircleIcon } from "@heroicons/vue/solid";

const $router = useRouter();
const dispatchstore = usereceiptstore();
const receiptstore = usereceiptstore();

const selectedRemark = ref('');
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const remarksArray = ref([])

const moment = inject("moment");
const Swal = inject("Swal");
const emit = defineEmits(['update', 'close']);
const props = defineProps({
  isOpen: Boolean,
  dispatch: Object
});

const receipt = ref({ NoBags: 0 })

const closeDialog = () => {
  receipt.value = {}
  emit('close');
};

const addRemark = (index) => {
  remarksArray.value.push({ remark: '', quantity: 0 });
};

const removeRemark = (remarkIndex) => {
  remarksArray.value.splice(remarkIndex, 1);
};

onMounted(() => { });

const resetReceipt = async () => {
  receipt.value = {}
}

const isDecimal = (num) => {
  return num % 1 !== 0;
}

const computedTonnage = computed(() => {
  let TonnageConversion = props.dispatch?.loadingPlan?.commodity.PackSize / 1000;

  // Apply toFixed(2) only if the number is a decimal
  if (isDecimal(TonnageConversion)) {
    TonnageConversion = parseFloat(TonnageConversion.toFixed(2));
  }

  let Tonnage = receipt.value.NoBags * TonnageConversion;

  // Apply toFixed(2) to the final result
  return isDecimal(Tonnage) ? parseFloat(Tonnage.toFixed(2)) : Tonnage;
});

const quantityLabel = computed(() => {
  return props.dispatch?.loadingPlan?.commodity?.commodityTypeId === 1 ? "Quantity (MT)" : "Quantity (Units)";
});

const validateNumberInput = (event) => {
  // Allow only numeric input
  if (!/^\d*$/.test(event.key)) {
    event.preventDefault();
  }
}

const submitReceipt = async () => {
  if (receipt.value.Date) {
    receipt.value.Date = moment(receipt.value.Date).toISOString();
  }

  const createdReceipts = [];
  const errors = [];

  for (const remarkEntry of remarksArray.value) {
    const newReceipt = {
      ...receipt.value,
      Remarks: remarkEntry.Remarks,
      Quantity: remarkEntry.quantity,
      RecipientId: user.value.id,
      dispatchId: props.dispatch.id
    };

    try {
      const result = await receiptstore.create(newReceipt);
      createdReceipts.push(result);
    } catch (error) {
      errors.push(error);
    }
  }

  if (createdReceipts.length) {
    emit('update');
    Swal.fire({
      title: "Receipts Created",
      html: `
      <p>Your receipts have been successfully created.</p>
      <p><strong>Receipt IDs:</strong> ${createdReceipts.map(r => r.id).join(', ')}</p>`,
      icon: "success",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Go to Receipts",
      cancelButtonColor: '#aaa',
    }).then((result) => {
      closeDialog();
      $router.push('/field/receipts/leanseason');
    });
  }

  if (errors.length) {
    Swal.fire({
      title: "Some Receipts Failed",
      text: "Unable to complete some of the receipts. Please review the details.",
      icon: "error",
      confirmButtonText: "Review Details",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      focusConfirm: false,
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button"
      }
    });
  }
};
</script>
