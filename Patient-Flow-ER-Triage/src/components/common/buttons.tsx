import React from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Variant = "light" | "dark";
type IconName = keyof typeof Ionicons.glyphMap;

type AppButtonProps = {
  label: string;
  variant?: Variant;
  icon?: IconName;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className: string;
};

export const sizeStyles = {
  sm: "px-4 py-2 gap-1.5",
  md: "px-5 py-2.5 gap-2",
  lg: "px-6 py-3 gap-2.5",
};

export const textSizeStyles = {
  sm: "text-[13px]",
  md: "text-[14px]",
  lg: "text-[15px]",
};

export function AppButton({
  label,
  variant = "light",
  icon,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  size = "md",
  className,
}: AppButtonProps) {
  const isLight = variant === "light";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        flex-row items-center justify-center rounded-full border
        ${sizeStyles[size]}
        ${
          isLight
            ? "bg-white border-slate-200 active:bg-slate-50"
            : "bg-[#101828] border-[#101828] active:bg-[#1a2942]"
        }
        ${disabled ? "opacity-50" : "opacity-100"}
        ${fullWidth ? "w-full" : "self-start"}
        ${className}
      `}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isLight ? "#334155" : "#ffffff"}
        />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={size === "sm" ? 16 : 18}
          color={isLight ? "#334155" : "#ffffff"}
          style={{ opacity: isLight ? 0.9 : 1 }}
        />
      ) : null}

      <Text
        className={`
          font-semibold tracking-wide
          ${textSizeStyles[size]}
          ${isLight ? "text-slate-700" : "text-white"}
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// --- Usage examples ---
// <AppButton label="Reset" variant="light" icon="refresh" onPress={handleReset} />
// <AppButton label="Pause" variant="dark" icon="pause" onPress={handlePause} />
// <AppButton label="Resume" variant="dark" icon="play" />
// <AppButton label="Reset" variant="light" icon="refresh-outline" size="sm" />
