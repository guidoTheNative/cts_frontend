<template>
  <div>
    <button @click="open = true"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100">
      <PlusCircleIcon class="h-5 w-5 mr-1" />
      Create Receipt
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="open = false" static>
        <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-2 text-center sm:block sm:p-0">
          <TransitionChild as="template" v-if="open" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div
              class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="text-md font-bold leading-normal text-gray-800 mb-1 mr-2" id="formModalLabel">
                  Emergency Response Dispatch
                </h5><br>
                <h5 class="text-md font-medium leading-normal text-gray-800 mb-1" id="formModalLabel">
                  Create Receipt for Instruction (<b>ID: {{ props.rowId }} </b>)
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false">
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
              <form @submit.prevent="onSubmit">
                <div class="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                  <div class="container mx-auto px-4 py-6">
                    <div class="flex gap-8">
                      <div class="flex-1 bg-white rounded-table p-4">
                        <h3 class="text-xl font-semibold mb-4">Dispatch Details</h3>
                        <p class="mb-4"><strong>Delivery Note:</strong> {{ dispatch.DeliveryNote }}</p>
                        <p class="mb-4"><strong>FDP:</strong> {{ dispatch.FinalDestinationPoint }}</p>
                        <p class="mb-4"><strong>Truck Number:</strong> {{ dispatch.TruckNumber }}</p>
                        <p class="mb-4"><strong>Driver Name:</strong> {{ dispatch.DriverName }}</p>
                        <p class="mb-4"><strong>Driver License:</strong> {{ dispatch.DriverLicense }}</p>
                        <h3 class="text-lg font-semibold text-blue-500 mb-3">List of Goods Dispatched: </h3>
                        <div>
                          <table class="min-w-full bg-white border border-0 rounded-lg">
                            <thead class="bg-blue-100">
                              <tr>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  #</th>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  Commodity</th>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  Quantity</th>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  Unit</th>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  Remarks</th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                           
                              <tr v-for="(item, index) in dispatch.dispatchedCommodities" :key="index"
                                class="hover:bg-gray-100">
                                <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
                                <td class="py-2 px-4 border-b">{{ item.commodity.Name }}</td>
                                <td class="py-2 px-4 border-b">{{ item.Quantity }}  {{ item.commodity.commodityTypeId == 1 ? 'MT' : 'Units' }}</td>
                                <td class="py-2 px-4 border-b">{{ item.commodity.PackSize }} {{ item.commodity.Unit }}
                                </td>
                                <td class="py-2 px-4 border-b">
                                  <div class="space-y-2">
                                    <div v-for="(remark, i) in item.remarks" :key="i"
                                      class="flex items-center space-x-2">

                                      <div class="col-span-6 sm:col-span-3">
                        
                                        <label class="text-sm font-medium text-gray-700">Select Remark</label>
                                     
                                      <select name="Remarks" v-model="remark.remark" id="Remarks"
                                        class="mt-2 block w-60 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Select Remark</option>
                                        <option value="received in good condition">Received in good condition</option>
                                        <option value="received but damaged">Received but damaged</option>
                                        <option value="received but not expected quantity">Received but not at the
                                          expected quantity</option>
                                        <option value="other">Other (please specify)</option>
                                      </select>
                                      </div>

                                      <div class="col-span-6 sm:col-span-3">
                        
                                      <label for="quantity" class="text-sm font-medium text-gray-700">Quantity ({{ item.commodity.commodityTypeId == 1 ? 'MT' : 'Units' }})</label>
                                     
                                      <input type="number" v-model.number="remark.quantity" min="0"
                                        placeholder="Qty Received"
                                        class="mt-2 block w-40 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                     
                                      </div>
                                      <button @click="removeRemark(index, i)"
                                        class="ml-2 mt-6 inline-flex items-center p-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        <MinusCircleIcon class="h-5 w-5" />
                                      </button>
                                    </div>
                                  </div>
                                  <button @click="addRemark(index)" type="button"
                                    class="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100">
                                    <PlusCircleIcon class="h-5 w-5 mr-1" />
                                    Add Remark
                                  </button>
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
                    class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">Close</button>
                  <button type="submit"
                    class="px-4 py-2 mr-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center">
                    <CheckCircleIcon class="h-5 w-5 mr-1" />
                    Submit Receipt
                  </button>
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
import { ref, reactive, inject } from "vue";
import { defineProps, defineEmits } from "vue";
import { PlusCircleIcon, MinusCircleIcon, XIcon, CheckCircleIcon } from "@heroicons/vue/solid";
import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { useForm, useSubmitForm } from "vee-validate";
import { CreateRequisitionSchema } from "../../../services/schema/requisition.schema";
import { useSessionStore } from "../../../stores/session.store";

const Swal = inject('Swal');
const props = defineProps({
  rowId: {
    type: [String, Number],
    required: true
  },
  dispatch: Object,
  dispatchedCommodities: Array
});

const emit = defineEmits(["create"]);
const open = ref(false);
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

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

const receivedCommodities = reactive([]);
//const errorMessage = ref('');

const addRemark = (index) => {
  if (!props.dispatch.dispatchedCommodities[index].remarks) {
    props.dispatch.dispatchedCommodities[index].remarks = [];
  }

  // Check if there is already an empty remark or if a remark of the same type exists
/*   const existingRemark = props.dispatch.dispatchedCommodities[index].remarks.find(remark => remark.remark === '' || remark.remark === 'received in good condition');
  if (existingRemark) {
    // Display an error message or take appropriate action
    return;
  }
 */
  props.dispatch.dispatchedCommodities[index].remarks.push({ remark: '', quantity: 0 });
};

const removeRemark = (itemIndex, remarkIndex) => {
  props.dispatch.dispatchedCommodities[itemIndex].remarks.splice(remarkIndex, 1);
};

const onSubmit = useSubmitForm((values) => {
  props.dispatch.dispatchedCommodities.forEach((item) => {
    if (item.remarks && item.remarks.length > 0) {
      item.remarks.forEach((remark) => {
        if (remark.remark) {
          receivedCommodities.push({
            BatchNumber: item.BatchNumber,
            commodityId: item.commodity.id,
            Quantity: remark.quantity,
            Remarks: remark.remark,
          });
        }
      });
    }
  });

  let model = {
    FinalDestinationPoint: props.dispatch.FinalDestinationPoint,
    RecipientId: user.value.id,
    CreatedOn: new Date().toISOString(),
    instructedDispatchId: props.rowId,
    receivedCommodities: receivedCommodities
  };

  emit("create", model);
  open.value = false;
});
</script>
