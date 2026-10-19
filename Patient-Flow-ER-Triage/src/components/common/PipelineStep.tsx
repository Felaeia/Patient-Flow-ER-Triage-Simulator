import { Text, View } from "react-native";

export default function PipelineStep({ icon: Icon, label, count, isLast = false }: any) {
  return (
    <View className="flex flex-row items-center flex-1">
      <View className="flex flex-row items-center gap-3">
        <View className="h-10 w-10 rounded-full bg-slate-900 items-center justify-center">
          <Icon size={18} color="white" />
        </View>
        <View>
          <Text className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
            {label}
          </Text>
          <Text className="text-[20px] font-bold text-slate-900 leading-tight">
            {count}
          </Text>
        </View>
      </View>
      {!isLast && <View className="flex-1 h-[1px] bg-slate-200 mx-4" />}
    </View>
  );
}