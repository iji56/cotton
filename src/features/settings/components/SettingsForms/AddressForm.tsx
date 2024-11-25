import Wrapper from "@/components/Wrapper";
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { SSF } from "./SettingsForms.styles";
import { reduxDispatch, reduxSelect } from "@/types/reduxHooks";
import { Controller, useForm } from "react-hook-form";
import { UserAddressType } from "../../types/userAddressType";
import { supabase } from "@/lib/supabase";
import { usermetaError, usermetaUpdate } from "@/store/actions/usermetaActions";
import { whiteUppercase, normalizeWhitespaces } from "@/utils/formSanitization";

/**
 * Address Form
 * NOTE: country formInput is currently disabled
 * 
 * @returns jsx
 */
const AddressForm = () => {
  const dispatch = reduxDispatch();
  const usermeta = reduxSelect(state => state.usermeta);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      street_address_line_1: usermeta.street_address_line_1 ?? '',
      street_address_line_2: usermeta.street_address_line_2 ?? '',
      city: usermeta.city ?? '',
      state: usermeta.state ?? '',
      postal_code: usermeta.postal_code ?? '',
      country: usermeta.country ?? ''
    }
  });

  /**
   * Submit Address does the following:
   * 1. sanitizes form input data
   * 2. updates user's supabase row
   * 3. supabase returns user's usermeta row
   * 4. Redux->usermeta is updated
   * 
   * @param formData || error
   */
  const submitAddress = async (formData: UserAddressType) => {
    try {
      const sanitized = {
        street_address_line_1: normalizeWhitespaces(formData.street_address_line_1),
        street_address_line_2: normalizeWhitespaces(formData.street_address_line_2),
        city: normalizeWhitespaces(formData.city),
        state: whiteUppercase(formData.state),
        postal_code: whiteUppercase(formData.postal_code),
        country: whiteUppercase(usermeta.country)
      }

      let { data, error } = await supabase
        .from('user_meta')
        .update({
          street_address_line_1: sanitized.street_address_line_1,
          street_address_line_2: sanitized.street_address_line_2,
          city: sanitized.city,
          state: sanitized.state,
          postal_code: sanitized.postal_code,
          country: sanitized.country
        })
        .eq('id', usermeta.id)
        .select()
      
      if (error) throw new Error((error).message);

      if (data) {
        dispatch(usermetaUpdate(data[0]))
      }
    } catch (error) {
      dispatch(usermetaError((error as Error)))
    }
  }

  return (
    <Wrapper>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Street Address Line 1"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={SSF.textInput}
            />
          )}
          name="street_address_line_1"
        />
        {errors.street_address_line_1 && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Street Address Line 2"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={SSF.textInput}
            />
          )}
          name="street_address_line_2"
        />
        {errors.street_address_line_2 && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="city"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={SSF.textInput}
            />
          )}
          name="city"
        />
        {errors.city && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 2,
            maxLength: 2,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="province"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={SSF.textInput}
            />
          )}
          name="state"
        />
        {errors.state && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 6,
            maxLength: 6,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="postal code"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={SSF.textInput}
            />
          )}
          name="postal_code"
        />
        {errors.postal_code && <Text>This is required.</Text>}

        <TouchableOpacity
          style={SSF.button}
          onPress={handleSubmit(submitAddress)}
        >
          <Text style={SSF.buttonText}>save</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  )
}

export default AddressForm;