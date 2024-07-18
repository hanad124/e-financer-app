import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter, useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";

import Logo from "../../assets/Logo.png";

import { sendPasswordResetLink } from "../../apicalls/auth";

// schema
const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [time, setTime] = useState(0); // time to resend email [in seconds

  // resend email timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  console.log("time", time);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await sendPasswordResetLink(data);
      if (res?.data?.success) {
        alert(`${res?.data.message}`);
        setSuccess(`${res?.data.message}`);
        setLoading(false);

        // start timer
        setTime(60);
      } else {
        setLoading(false);
        alert(`${res?.data.message}`);
      }
    } catch (error) {
      alert(`${res?.data.message}`);
      setError(`${res?.data.message}`);
      console.error("API call error", error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center min-h-[90vh] px-4 my-6 mt-10">
          <View className="flex flex-col items-center justify-center mb-10">
            <Image source={Logo} className="w-28 h-28 mx-auto" />
            <Text className="text-xl text-black font-bold text-center -mt-6">
              e-Financer
            </Text>
          </View>
          <Text className="text-3xl text-black font-bold text-center">
            Reset password
          </Text>
          <Text className="text text-gray-400 mt-4 text-center ">
            Enter your email address to reset your password
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

            {/* <Link
              href={"(auth)/reset-password"}
              className="text-blue-500 font-semibold text-right mt-4 block"
            >
              <Text>Forgot password?</Text>
            </Link> */}
            <View>
              <CustomButton
                text={`${
                  time === 0 ? "Resend email" : `Resend in ${time} seconds`
                }`}
                disabled={time !== 0}
                handlePress={handleSubmit(onSubmit)}
                containerStyles={`w-full mt-6 flex items-center gap-2 justify-center ${
                  time === 0 ? "bg-primary" : "bg-gray-300"
                }`}
                isLoading={loading}
                loadinState={"sending email..."}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
