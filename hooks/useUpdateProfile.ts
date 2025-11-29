import { useToast } from "@/hooks/useToast";
import { profileupdateService } from "@/service/profileupdate.service";
import { ContactSupportType } from "@/types/profile.types";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user: currentUser, login } = useAuthStore();

  return useMutation({
    mutationFn: (userData: {
      username?: string;
      name?: string;
      language?: string;
      timezone?: string;
      avatarFile?: any
    }) => {
      return profileupdateService.editProfile(userData);
    },

    onSuccess: (data, variables) => {
      // ✅ Update auth store with returned data from API
      if (currentUser && data.data) {
        const updatedUser = {
          ...currentUser,
          name: variables.name || currentUser.name,
        };
        login(updatedUser, useAuthStore.getState().token!);
      }

      // ✅ Invalidate user query to refetch fresh data including avatar
      queryClient.invalidateQueries({ queryKey: ['user'] });

      showToast(data.message || "Profile updated successfully", "success");

      // ✅ Use router.back() for better navigation
      router.back();
    },

    onError: (error: any) => {
      console.error('Profile update error:', error);

      // ✅ Handle specific error cases from API
      if (error?.status_code === 400) {
        showToast("Username already exists. Please choose another.", "error");
      } else if (error?.status_code === 422 && error?.errors) {
        // Show first validation error
        const firstError = Object.values(error.errors)[0];
        showToast(Array.isArray(firstError) ? firstError[0] : "Validation failed", "error");
      } else {
        showToast(error?.message || "Profile update failed", "error");
      }
    },
  });
};

export const useContactSupport = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (userData: ContactSupportType) => {
      return profileupdateService.contactSupport(userData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("Thank you for contacting us", "success");
      router.back();
    },

    onError: (error: any) => {
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