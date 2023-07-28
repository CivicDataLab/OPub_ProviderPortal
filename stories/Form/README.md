# Form

## Form Example

Recommended way is to ceate a new file for each Form component. You can copy the `FormExample` file and remove the components you don't need.

### Custom Props

- `formik` (Required) - Pass the formik object that is initialised in the file.
- `name` (Required) - unique name for the form field. Formik, Yup needs it to connect with form.
- `onFieldChange` (Optional) - custom event handler which will first trigger `formik.setFieldValue` and then whatever you passed in it.
