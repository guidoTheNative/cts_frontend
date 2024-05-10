<template>
  <main class="space-y-4">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900 capitalize">
            Relief Items
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Add relief materials for the instruction.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit="onSubmit">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="space-y-4">
                  <!-- Loop to Add Multiple Relief Items -->
                  <div v-for="(item, index) in reliefItems" :key="index" class="flex space-x-4 items-center">
                    <div class="flex-1">
                      <label class="block text-sm font-bold text-gray-700">Commodity</label>
                      <select v-model="item.commodityId" @change="validateCommodity(index)"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
                        <option value="" disabled>Select a commodity</option>
                        <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.id">
                          {{ commodity.Name }}
                        </option>
                      </select>
                      <!-- Display Error Message if the Commodity is Duplicated -->
                      <p v-if="item.error" class="text-red-500 text-xs italic pt-1">{{ item.error }}</p>
                    </div>

                    <div class="flex-1">
                      <label class="block text-sm font-bold text-gray-700">Quantity</label>
                      <input type="number" v-model.number="item.Quantity"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        placeholder="Quantity" />
                    </div>

                    <!-- Remove Item Button -->
                    <button type="button" @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">
                      &times; <!-- A simple cross to remove the item -->
                    </button>
                  </div>

                  <!-- Button to Add New Item -->
                  <button type="button" @click="addNewItem"
                    class="mt-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md">
                    + Add Relief Item
                  </button>
                </div>


              </div>

              <!-- Submit Button -->
              <div class="px-4 py-3 text-right sm:px-6">
                <button type="submit"
                  class="inline-flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
//SCHEMA AND STORES
import { UpdateUserSchema } from "../../../services/schema/commoditytype.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useInstructedCommoditiesStore } from "../../../stores/instructedCommodities.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { usecommoditiestore } from "../../../stores/commodity.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
const props = defineProps({
  model: Object,
});
//VARIABLES
const emit = defineEmits(["update"]);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Instruction Management", href: "/field/instruction-management", current: false },
  { name: "Edit", href: "#", current: true },
];
const WarehouseStore = usewarehousestore();

const instructedCommodityStore = useInstructedCommoditiesStore();

const commodityStore = usecommoditiestore()
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const warehouses = reactive([]);

const commodities = reactive([])
const { model } = toRefs(props);
///FORM
const { meta } = useForm({
  validationSchema: UpdateUserSchema,
  // initialValues: {
  //   id: model.value.id,
  //   firstName: model.value.firstName,
  //   lastname:  model.value.lastname,
  //   phone:  model.value.phone,
  //   email:  model.value.email,
  //   status:  model.value.status,
  //   roleId:  model.value.roleId,
  // },
});
///FIELDS


const reliefItems = reactive([
  { commodityId: "", Quantity: 1, error: "", id: "" }
]);



// Method to Add New Relief Item
const addNewItem = () => {
  reliefItems.push({ commodityId: "", Quantity: 1, error: "" });
};

// Method to Remove a Relief Item
const removeItem = async (index) => {
  // Ask for user confirmation
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  // Proceed only if user confirmed the action
  if (result.isConfirmed) {
    try {
      // Attempt to remove the item
      await instructedCommodityStore.remove(index);
      await getReliefItems(); // Refresh the relief items list

      // Notify the user of successful deletion
      Swal.fire({
        title: "Deleted!",
        text: "Your item has been deleted.",
        icon: "success",
      });
    } catch (error) {
      // Handle any errors that occur during the removal process
      Swal.fire({
        title: "Failed",
        text: `Failed to delete the item (${error.message})`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }
};


// Check if a Commodity is Duplicated
const validateCommodity = (index) => {
  const selectedCommodity = reliefItems[index].commodityId;
  const isDuplicate = reliefItems.some((item, idx) => item.commodityId === selectedCommodity && idx !== index);
  reliefItems[index].error = isDuplicate ? "Commodity already added. Please select another." : "";
};

const toggle = ref(false);
//MOUNTED
onMounted(() => {

  getCommodities()
  //Assign

  getReliefItems()

});

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  // Get the instructionId from the route parameters

  const instructionId = parseInt($route.params.id, 10);

  // Check if the existing `reliefItems` loaded during `onMounted` is populated
  let itemsToSubmit = reliefItems.length > 0 ? reliefItems : [{ commodityId: "", Quantity: 1, error: "" }];

  // Ensure each item has the correct instructionId
  const newValues = itemsToSubmit.map(item => ({
    ...item, // Spread existing properties
    instructionId, // Add the instructionId to each object
  }));

  console.log(newValues, "xvix")
  // Remove any `error` fields before submission
  const cleanedValues = newValues.map(({ error, ...cleanedItem }) => cleanedItem);

  emit("update", cleanedValues);
});


const getReliefItems = async () => {
  isLoading.value = true;
  const instructionId = $route.params.id;

  try {
    // Fetch all instructed commodities
    const result = await instructedCommodityStore.get();

    // Filter the result by instructionId
    const filteredItems = result.filter(item => item.instructionId == instructionId);

    // Push filtered items into the reactive `reliefItems` array
    reliefItems.splice(0, reliefItems.length, ...filteredItems.map(item => ({
      commodityId: item.commodityId,
      Quantity: item.Quantity,
      instructionId: instructionId,
      id: item.id
    })));

  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: `Failed to get relief items (${error.message})`,
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};
const getCommodities = async () => {
  isLoading.value = true;
  commodityStore
    .get()
    .then((result) => {
      commodities.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get commodities error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};





</script>
