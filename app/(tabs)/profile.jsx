import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller, set } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import { useAuthStore } from "../../store/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getUser } from "../../utils/storage";

import BannerImage from "../../assets/images/banner-img.png";

// Profile schema
const ProfileSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  description: z.string().optional(),
});

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  console.log("user", user?.data);

  const userData = user?.data;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      description: userData?.description,
    },
  });

  useEffect(() => {
    console.log("userData", userData);

    setValue("name", userData?.name);
    setValue("email", userData?.email);
    setValue("description", userData?.description);
  }, [useAuthStore.getState().user]);

  const onSubmit = (data) => {
    console.log("data", data);
  };

  return (
    <SafeAreaView>
      <ScrollView className="">
        <View className="w-full  min-h-[90vh] px-4 my-6 mt-10 bg-white">
          {/* 
          profile banner with user avatar and name
           */}

          <Image
            source={BannerImage}
            style={{
              width: "100%",
              height: 170,
              position: "absolute",
              top: 0,
              left: "50%",
              borderRadius: 15,
              transform: [{ translateX: -158 }],
            }}
          />

          <View className="flex items-center justify-center mt-24">
            <Image
              source={{
                uri: userData?.avatar,
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
            <Text className="text-xl font-pmedium mt-2">{userData?.name}</Text>
            <Text className="text-sm font-pregular text-slate-500">
              {userData?.email}
            </Text>
          </View>

          {/*
          Profile form
           */}
          <View className="mt-10 ">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  // style={styles.input}
                  className=" border-[1px] border-slate-400 px-4 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Name"
                />
              )}
              name="name"
            />
            {errors.name && (
              <Text className="text-red-500">{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border-[1px] border-slate-400 px-4 rounded-lg shadow py-[9px] w-full mt-6 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Email"
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text className="text-red-500">{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border-[1px] border-slate-400 px-4 rounded-lg shadow py-[9px] w-full mt-6 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Description"
                />
              )}
              name="description"
            />
            {errors.description && (
              <Text className="text-red-500">{errors.description.message}</Text>
            )}

            <CustomButton
              text="Save"
              onPress={handleSubmit(onSubmit)}
              containerStyles="mt-10"
              isLoading={loading}
              loadinState="Saving..."
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    // margin: 12,
    marginTop: 25,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default Profile;
