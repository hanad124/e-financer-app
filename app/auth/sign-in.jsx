import React, { useLayoutEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, usePathname, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import { Eye, EyeOff } from "lucide-react-native";
import { login } from "../../apicalls/auth";
import { getToken, saveToken, saveUser } from "../../utils/storage";
import { AuthContext } from "../../context/authContext";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated, isLoading } =
    useContext(AuthContext);

  console.log("isAuthenticated", isAuthenticated);

  const pathname = usePathname();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      console.log("login res", res?.data);
      if (res?.data?.success) {
        setLoading(false);
        await saveToken(res.data.user.token);
        await saveUser(res.data.user);
        setIsAuthenticated(true);
        router.push("/home");
        reset();
      } else {
        alert(`${res.data.message}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("API call error", error);
      setLoading(false);
    }
  };

  // if (isAuthenticated) {
  //   router.push("/home");
  //   return null;
  // }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center min-h-[90vh] px-4 my-6 mt-10">
          <Text className="text-3xl text-black font-bold text-center">
            Welcome Back
          </Text>
          <Text className="text text-gray-400 mt-4 text-center ">
            Don't have an account?{" "}
            <Link
              href={"/auth/sign-up"}
              className="text-blue-500 font-semibold"
            >
              Sign up
            </Link>
          </Text>
          <View className="my-16">
            <Text className="text-base text-slate-600 font-pmedium">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  email
                  placeholder="Enter your email address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500">{errors.email.message}</Text>
            )}

            <Text className="text-base text-slate-600 font-pmedium mt-6">
              Password
            </Text>
            <View className="relative w-full items-center">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-[40%] transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={24} color="gray" />
                ) : (
                  <Eye size={24} color="gray" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500">{errors.password.message}</Text>
            )}
            <View className="flex flex-row items-center justify-between">
              <Link
                href={"/auth/verify-email"}
                className="text-blue-500 font-semibold text-right mt-4 block"
              >
                <Text>Verify your email </Text>
              </Link>
              <Link
                href={"/auth/reset-password"}
                className="text-blue-500 font-semibold text-right mt-4 block"
              >
                <Text>Forgot password?</Text>
              </Link>
            </View>

            <View>
              <CustomButton
                text="Log in"
                handlePress={handleSubmit(onSubmit)}
                containerStyles={`w-full mt-6 flex items-center gap-2 justify-center`}
                isLoading={loading}
                loadinState={"logging in..."}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
