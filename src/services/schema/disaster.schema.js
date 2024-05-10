import * as yup from "yup";

export const CreateDisasterSchema = yup.object({
  name: yup
    .string(),
  type: yup
    .string(),
  district: yup
    .string(),
  ta: yup
    .string(),

  gvh: yup
    .string(),


  villages_affected: yup
    .string()
});

export const UpdateDisasterSchema = yup.object({
  name: yup
    .string(),
  type: yup
    .string(),
  district: yup
    .string(),
  ta: yup
    .string(),

  gvh: yup
    .string(),


  villages_affected: yup
    .string()
});



