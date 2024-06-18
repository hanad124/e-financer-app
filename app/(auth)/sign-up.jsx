import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useForm, Controller, set } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import { Eye, EyeOff, Loader } from "lucide-react-native";
import { signUp } from "../../apicalls/auth";
import Toast from "react-native-toast-message";

// Define validation schema using zod
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await signUp(data);
      console.log("res", res);
      if (res.status === 200) {
        // Toast.show({
        //   type: "success",
        //   text1: "Success",
        //   text2: "Login successful",
        // });
        setLoading(false);
        alert(`${res.data.message}`);
        router.push("/home");
      } else {
        // Toast.show({
        //   type: "error",
        //   text1: "Error",
        //   text2: "Login failed",
        // });
        alert(`${res.data.message}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("API call error", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Login failed",
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="">
        <View className="w-full justify-center min-h-[90vh] px-4 my-6 mt-10">
          <Text className="text-3xl text-black font-bold text-center">
            Create an account
          </Text>
          <Text className="text text-gray-400 mt-4 text-center ">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="text-blue-500 font-semibold">
              Sign In
            </Link>
          </Text>
          <View className="my-16">
            <Text className="text-base text-slate-600 font-pmedium ml-">
              Name
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  placeholder="Enter your name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500">{errors.name.message}</Text>
            )}
            <Text className="text-base text-slate-600 font-pmedium mt-6 ml-">
              Email
            </Text>
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

            <View className="mt-10">
              <CustomButton
                text="Create account"
                handlePress={handleSubmit(onSubmit)}
                containerStyles={`w-full mt-6 flex items-center gap-2 justify-center
                } `}
                isLoading={loading}
                loadinState={"Creating account..."}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
