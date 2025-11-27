import { COLORS } from "@/constants/colors";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import EyeIcon from "../../Icons/EyeIcons/EyeIcon";
import EyeOpenIcon from "../../Icons/EyeIcons/EyeOpenIcon";

type AuthInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  rules?: object;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
};

export default function AuthInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  rules,
  secureTextEntry = false,
  keyboardType = "default",
}: AuthInputProps<T>) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.inputItem}>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize="none"
            secureTextEntry={isSecure}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value as string}
          />
          {secureTextEntry && (
            <Pressable
              style={styles.eyeBtn}
              onPress={() => setIsSecure((prev) => !prev)}
            >
              {isSecure ? <EyeIcon /> : <EyeOpenIcon />}
            </Pressable>
          )}
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 56,
    padding: 12,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: COLORS.bgGray,
    color: COLORS.primary,
    fontWeight: 600,
    fontSize: 16,
    fontFamily: "Manrope-SemiBold",
  },
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  inputItem: {},
  eyeBtn: {
    position: "absolute",
    right: 20,
    top: 23,
  },
});
