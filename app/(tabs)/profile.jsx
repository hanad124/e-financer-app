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
import * as FileSystem from "expo-file-system";

import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import { useAuthStore } from "../../store/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getUser } from "../../utils/storage";
import { useNavigation } from "expo-router";

import { updateProfile } from "../../apicalls/auth";

import BannerImage from "../../assets/images/banner-img.png";
import { ArrowLeft } from "lucide-react-native";

import * as ImagePicker from "expo-image-picker";

// Profile schema
const ProfileSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  description: z.string().optional(),
});

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const user = useAuthStore((state) => state.user); // Assuming this gets the logged-in user's data
  const [image, setImage] = useState(user?.data?.avatar);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB size limit

  const pickImage = async () => {
    if (hasGalleryPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("result", result);

      if (!result.cancelled) {
        const base64Image = await FileSystem.readAsStringAsync(
          result?.assets[0]?.uri,
          {
            encoding: "base64",
          }
        );
        const imageData = `data:image/jpeg;base64,${base64Image}`;

        setImage(imageData);
      }
    }
  };

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

  // track errors
  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  const onSubmit = async (data) => {
    image && (data.avatar = image);
    // console.log("data", data);
    try {
      setLoading(true);
      const response = await updateProfile(data);
      // console.log("response", response);
      console.log("Profile response", response.data);
      if (response?.data?.success) {
        useAuthStore.setState({
          user: response.data,
        });
        useAuthStore.getState().getUserInfo();
        alert(`${response?.data?.message}`);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      alert(`{response.message}`);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="bg-white">
        <View className="w-full  min-h-[90vh] px-4 my-6 mt-10 bg-white">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft className="text-black " size={24} />
            </TouchableOpacity>
            <Text
              style={{
                color: "black",
                // fontFamily: "pmedium",
                fontSize: 24,
                marginLeft: 80,
              }}
            >
              Profile
            </Text>
          </View>
          {/* 
          profile banner with user avatar and name
           */}

          <Image
            source={BannerImage}
            style={{
              width: "100%",
              height: 170,
              position: "relative",
              top: 0,
              // left: "50%",
              borderRadius: 15,
              // transform: [{ translateX: -163 }],
            }}
          />

          <View className="flex items-center justify-center mt-24">
            <View className="relative top-[-100%] flex flex-col justify-center items-center">
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#D3D8DB",
                  borderWidth: 1,
                  borderColor: "#D3D8DB",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                ) : (
                  <Image
                    source={{
                      uri:
                        user?.data?.avatar ||
                        "https://img.freepik.com/free-icon/user_318-644324.jpg?w=360",
                    }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                )}
              </TouchableOpacity>
              <Text className="text-xl font-pmedium mt-2">
                {userData?.name}
              </Text>
              <Text className="text-sm font-pregular text-slate-500">
                {userData?.email}
              </Text>
            </View>
          </View>

          {/*
          Profile form
           */}
          <View className="mt-2 relative top-[-15%] ">
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
              handlePress={handleSubmit(onSubmit)}
              containerStyles="mt-10"
              isLoading={loading}
              loadinState="Saving..."
            />
          </View>

          {/* export data */}
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
