import { useToast } from "@/hooks/useToast";
import { profileupdateService } from "@/service/profileupdate.service";
import { ContactSupportType, EditProfileType } from "@/types/profile.types";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { setLoading, user: currentUser, login } = useAuthStore.getState();

  return useMutation({
    mutationFn: (userData: { username: string; name: string; avatarFile?: any }) => {
      return profileupdateService.editProfile(userData);
    },

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: (data, variables) => {
      setLoading(false);

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: variables.name,
        };
        login(updatedUser, useAuthStore.getState().token!);
      }

      queryClient.invalidateQueries({ queryKey: ['user'] });

      showToast("Profile updated successfully", "success");

      router.push("/(tabs)/(profile)/ProfileScreen");
    },

    onError: (error: any) => {
      setLoading(false);
      showToast(error?.message || "Profile update failed", "error");
    },
  });
};

export const useContactSupport = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { setLoading } = useAuthStore.getState();

  return useMutation({
    mutationFn: (userData: ContactSupportType) => {
      return profileupdateService.contactSupport(userData);
    },

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("Thank you for contacting us", "success");
      router.push("/(tabs)/(profile)/ProfileScreen");
    },

    onError: (error: any) => {
      setLoading(false);
      showToast(
        error?.message || "Please ensure all required fields are correctly filled and try again.",
        "error"
      );
    },
  });
};

export const useVerifyEmail = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      profileupdateService.verifyOtp({ email, otp }),
    onSuccess: () => {
      showToast("Email verified successfully!", "success", 4000);
    },
    onError: (error: any) => {
      showToast(error.message || "Invalid verification code", "error");
    },
  });
};

export const useResendVerification = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (email: string) =>
      profileupdateService.resendVerification({ email }),
    onSuccess: () => {
      showToast("Verification code sent! Check your inbox.", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to resend code", "error");
    },
  });
};

export const useRequestOtp = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (email: string) => profileupdateService.requestOtp({ email }),
    onSuccess: (data, email) => {
      showToast("Password reset email sent! Check inbox.", "info");
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email },
      });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to send reset email", "error");
    },
  });
};

export const useVerifyOtp = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      profileupdateService.verifyOtp({ email, otp }),
    onSuccess: () => {
      showToast("OTP verified successfully!", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Invalid OTP code", "error");
    },
  });
};