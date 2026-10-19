import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Users } from 'lucide-react-native';

export function StaffResources({ staff }: any) {
  const busyCount = staff.filter((n: any) => n.status === "Busy").length;

  return (
    <View className="rounded-[20px] bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
      
      {/* Header */}
      <View className="px-4 h-[52px] flex flex-row items-center justify-between border-b border-slate-100">
        <View className="flex flex-row items-center gap-2">
          <Users size={16} color="#0f172a" />
          <Text className="text-[13px] font-semibold tracking-wide text-slate-900">
            STAFF & RESOURCES
          </Text>
        </View>
        <Text className="text-[11px] text-slate-500">
          {busyCount} / {staff.length} busy
        </Text>
      </View>

      {/* Staff List */}
      <ScrollView className="p-3" contentContainerStyle={{ gap: 8 }}>
        {staff.map((n: any) => {
          // Dynamic styles based on role
          const isDoctor = n.role === "Doctor";
          const isNurse = n.role === "Nurse";
          
          const avatarContainerClass = isDoctor 
            ? "bg-slate-900" 
            : isNurse 
              ? "bg-slate-100 border border-slate-200" 
              : "bg-amber-100 border border-amber-200";
              
          const avatarTextClass = isDoctor ? "text-white" : "text-slate-900";

          // Dynamic styles based on status
          const isBusy = n.status === "Busy";
          const statusContainerClass = isBusy 
            ? "bg-amber-50 border-amber-200" 
            : "bg-emerald-50 border-emerald-200";
            
          const statusTextClass = isBusy ? "text-amber-700" : "text-emerald-700";

          return (
            <View 
              key={n.id} 
              className="rounded-xl border border-slate-200 px-3 py-2.5 flex flex-row items-center gap-3 bg-white"
            >
              {/* Avatar */}
              <View className={`h-8 w-8 rounded-full items-center justify-center ${avatarContainerClass}`}>
                <Text className={`text-[11px] font-bold ${avatarTextClass}`}>
                  {n.role[0]}
                </Text>
              </View>

              {/* Details */}
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-slate-900">
                  {n.name}
                </Text>
                <Text className="text-[11px] text-slate-500">
                  {n.role} {n.assignedPatientId ? `• ${n.assignedPatientId}` : "• idle"}
                </Text>
              </View>

              {/* Status Badge */}
              <View className={`px-2 py-1 rounded-full border ${statusContainerClass}`}>
                <Text className={`text-[10px] font-bold ${statusTextClass}`}>
                  {n.status}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}