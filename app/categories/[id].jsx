import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  ToastAndroid,
  Linking,
  Platform,
  TouchableOpacity,
} from "react-native";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import CustomButton from "../../components/CustomButton";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import { RadioButton } from "react-native-paper";

import { useCategoriesStore } from "../../store/categories";
import { updateCategory } from "../../apicalls/categories";
import LoadingOverlay from "../../components/LoadingOverlay";

// category schema [name, icon?]
const schema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name is too short")
    .max(15, "Name is too long"),
  icon: z.string().optional(),
});

const EditCategory = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overLeyLoading, setOverLeyLoading] = useState(false);
  const [searchIcon, setSearchIcon] = useState({
    id: "",
    url: "",
  });
  const [filteredIcons, setFilteredIcons] = useState([]);

  const { categoryId, category } = useCategoriesStore();

  console.log("single category::", category);

  const navigation = useNavigation();

  const icons = useCategoriesStore((state) => state.icons);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  //   defualt values
  useEffect(() => {
    setValue("name", category?.name);
    setSelectedIcon({
      id: category?.icons?.id,
      url: category?.icons?.icon,
    });
    setOverLeyLoading(false);
  }, [category]);

  const onSubmit = async (data) => {
    data.icon = selectedIcon?.id;
    // console.log(data);
    setLoading(true);
    try {
      const response = await updateCategory(categoryId, data);
      //   console.log(response);
      // if (response?.data?.status === 200) {
      setLoading(false);
      alert(response?.data?.message);
      useCategoriesStore.getState().getCategories();
      router.push("/categories");
      // }
      reset();
    } catch (error) {
      console.log(error);
      alert(response?.data?.message);
      setLoading(false);
    }
  };

  // search icons
  const searchIconHandler = (text) => {
    setSearchIcon(text);
    const filteredIcons = icons.filter((icon) =>
      icon?.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredIcons(filteredIcons);
    // console.log("filtered icons", filteredIcons);
  };

  return (
    <>
      <LoadingOverlay loading={overLeyLoading} />
      <SafeAreaView className="bg-white pt-5">
        <ScrollView className="bg-white">
          <View className="w-full  min-h-[90vh] px-4 my-6 mt-0  bg-white">
            <View className="flex flex-row items-center justify-between  my-2 mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="flex flex-row items-center"
              >
                <ChevronLeft size={18} color={"black"} />
                <Text className="text-[16px] text-gray-800 ml-2">Back</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-pmedium text-gray-800 my-2">
              Create Category
            </Text>
            <View className="mt-5">
              <Text className="text-black">Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Category Name"
                  />
                )}
                name="name"
                defaultValue=""
              />
              {errors.name && (
                <Text style={{ color: "red" }}>{errors.name.message}</Text>
              )}
            </View>

            {/* 
            search icons
             */}
            <View className="mt-5">
              <Text className="text-black">Search Icon</Text>
              <TextInput
                style={{
                  padding: 10,
                }}
                className="border-[1px] border-slate-400  rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                onChangeText={(text) => searchIconHandler(text)}
                value={searchIcon}
                placeholder="Search Icon"
              />
            </View>

            {/* 
            icons section
             */}
            <View className="mt-5">
              <Text className="text-black">Select Icon</Text>
              <View className="flex flex-wrap mt-2">
                <RadioButton.Group
                  onValueChange={(value) => setSelectedIcon(value)}
                  value={selectedIcon?.url}
                >
                  <View className="flex flex-row flex-wrap w-full space-x-2 min-w-full">
                    {filteredIcons.length > 0
                      ? filteredIcons?.map((icon) => (
                          <TouchableOpacity
                            key={icon?.id}
                            onPress={() =>
                              setSelectedIcon({
                                id: icon?.id,
                                url: icon?.icon,
                              })
                            }
                            className=""
                          >
                            <View
                              style={[
                                {
                                  borderRadius: 8,
                                  padding: 8,
                                  margin: 4,
                                },
                              ]}
                              className={`flex flex-col items-center p-4 rounded-lg ${
                                selectedIcon?.id === icon?.id
                                  ? "bg-primary"
                                  : "bg-primary/5"
                              }`}
                            >
                              <Image
                                source={{ uri: icon?.icon }}
                                style={{
                                  width: 35,
                                  height: 35,
                                }}
                                tintColor={
                                  selectedIcon?.url === icon?.icon
                                    ? "white"
                                    : "#6957E7"
                                }
                              />
                            </View>
                          </TouchableOpacity>
                        ))
                      : icons?.map((icon) => (
                          <TouchableOpacity
                            key={icon?.id}
                            onPress={() =>
                              setSelectedIcon({
                                id: icon?.id,
                                url: icon?.icon,
                              })
                            }
                            className=""
                          >
                            <View
                              style={[
                                {
                                  borderRadius: 8,
                                  padding: 8,
                                  margin: 4,
                                },
                              ]}
                              className={`flex flex-col items-center p-4 rounded-lg ${
                                selectedIcon?.id === icon?.id
                                  ? "bg-primary"
                                  : "bg-primary/5"
                              }`}
                            >
                              <Image
                                source={{ uri: icon?.icon }}
                                style={{
                                  width: 35,
                                  height: 35,
                                }}
                                tintColor={
                                  selectedIcon?.url === icon?.icon
                                    ? "white"
                                    : "#6957E7"
                                }
                              />
                            </View>
                          </TouchableOpacity>
                        ))}
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            {/* submit button */}
            <CustomButton
              text="Update Category"
              handlePress={() => {
                handleSubmit(onSubmit)();
              }}
              isLoading={loading}
              containerStyles="mt-5"
              loadinState={"Updating Category..."}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditCategory;
