import { View, Text } from 'react-native';

export default function VitalBadge({ icon: Icon, label, value, warn } : {icon: any, label:string value: string | number, warn: boolean}) {
    return (
    <View className={`rounded-full border px-2 py-1 flex flex-row items-center gap-1 ${warn ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
      <Icon size={12} color={warn ? "#dc2626" : "#64748b"} />
      <Text className={`text-[10px] font-bold ${warn ? "text-red-700" : "text-slate-700"}`}>{label}</Text>
      <Text className={`text-[10px] tabular-nums ${warn ? "text-red-700" : "text-slate-700"}`} numberOfLines={1}>{value}</Text>
    </View>
  );
}