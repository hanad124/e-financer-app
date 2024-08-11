import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";

import Logo from "../../assets/Logo.png";

import { verifyOTP } from "../../apicalls/auth";

// schema
const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const VerifyOtp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [time, setTime] = useState(0); // time to resend email [in seconds]
  const [otp, setOtp] = useState("");

  const otpInputRefs = useRef([]);

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

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await verifyOTP(data);
      if (res?.data?.success) {
        setSuccess(`${res?.data.message}`);
        setLoading(false);
        router.push("/auth/sign-in");
      } else {
        setLoading(false);
        setError(`${res?.data.message}`);
      }
    } catch (error) {
      setError(`${error.message}`);
      console.error("API call error", error);
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("");
    setOtp(updatedOtp);
    setValue("otp", updatedOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && index > 0 && !otp[index]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.appName}>e-Financer</Text>
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            Enter your OTP to verify your email
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={(text) => handleOtpChange(index, text)}
                  onKeyPress={({ nativeEvent: { key } }) =>
                    handleKeyPress(index, key)
                  }
                  value={otp[index] || ""}
                />
              ))}
            </View>
            {errors.otp && (
              <Text style={styles.errorText}>{errors.otp.message}</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {success && <Text style={styles.successText}>{success}</Text>}

            <Link href={"/auth/verify-email"} style={styles.resendLink}>
              <Text>Resend email</Text>
            </Link>
            <View>
              <CustomButton
                text={time === 0 ? "Verify OTP" : `Resend in ${time} seconds`}
                disabled={time !== 0 || otp.length !== 6}
                handlePress={handleSubmit(onSubmit)}
                containerStyles={[
                  styles.button,
                  time === 0 && otp.length === 6
                    ? styles.activeButton
                    : styles.inactiveButton,
                ]}
                isLoading={loading}
                loadinState={"Verifying OTP..."}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    marginTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 112,
    height: 112,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    marginTop: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 24,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  successText: {
    color: "green",
    marginBottom: 8,
  },
  resendLink: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  inactiveButton: {
    backgroundColor: "#ccc",
  },
});

export default VerifyOtp;
