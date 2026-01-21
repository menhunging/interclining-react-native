import ButtonUI from "@/components/ui/Button/ButtonUI";
import AuthInput from "@/components/ui/Inputs/AuthInput/AuthInput";
import { COLORS } from "@/constants/colors";
import { loginUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { IAuthFormData } from "@/types/typesMobile/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { Image, StyleSheet, Text, View } from "react-native";

const AuthForm: React.FC = () => {
  const { loading, error } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    reset,
    control,
    formState: { isValid },
  } = useForm<IAuthFormData>({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IAuthFormData> = ({ login, password }) => {
    dispatch(loginUser({ login, password }));
    reset();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <AuthInput<IAuthFormData>
          control={control}
          name="login"
          placeholder="Логин"
          keyboardType="email-address"
          rules={{
            required: "Введите логин",
          }}
        />

        <AuthInput<IAuthFormData>
          control={control}
          name="password"
          placeholder="Пароль"
          secureTextEntry
          rules={{
            required: "Введите пароль",
            minLength: {
              value: 5,
              message: "Минимум 5 символов",
            },
          }}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ButtonUI onPress={handleSubmit(onSubmit)} disabled={!isValid || loading}>
        Вход
      </ButtonUI>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    fontSize: 22,
    marginBottom: 20,
    width: 190,
  },
  form: {
    flex: 1,
    gap: 12,
    width: "100%",
  },
  errorText: {
    color: COLORS.red,
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default AuthForm;
