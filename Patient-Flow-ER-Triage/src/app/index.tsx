import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';

// Import your built components
import { TriageInbox } from '../components/TriageInbox';
import { WaitingRoom } from '../components/WaitingRoom';

// Mock data generator so you can see the UI working immediately
const generateMockPatient = (id: number, status: 'triage' | 'waiting', esi?: number) => ({
  id: `P-${100 + id}`,
  age: Math.floor(Math.random() * 60) + 20,
  sex: Math.random() > 0.5 ? 'M' : 'F',
  complaint: ['Chest Pain', 'Fever', 'Laceration', 'Shortness of Breath'][Math.floor(Math.random() * 4)],
  vitals: {
    hr: Math.floor(Math.random() * 60) + 60,
    bpSys: Math.floor(Math.random() * 40) + 100,
    bpDia: Math.floor(Math.random() * 20) + 60,
    spo2: Math.floor(Math.random() * 5) + 95,
    temp: (36.5 + Math.random() * 2).toFixed(1),
  },
  pain: Math.floor(Math.random() * 10),
  esi: esi || null,
  suggestedEsi: Math.floor(Math.random() * 5) + 1,
  status: status,
  arrivalTs: 0,
  triageStartTs: 0,
  waitStartTs: status === 'waiting' ? 10 : null,
});

export default function PatientFlowDashboard() {
  const [simTime, setSimTime] = useState(0);
  
  // Seed state with mock patients
  const [patients, setPatients] = useState([
    generateMockPatient(1, 'triage'),
    generateMockPatient(2, 'triage'),
    generateMockPatient(3, 'waiting', 2),
    generateMockPatient(4, 'waiting', 4),
  ]);

  // Global timer to simulate the passing of time for the wait counters
  useEffect(() => {
    const timer = setInterval(() => setSimTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectPatient = (id: string) => {
    console.log('Selected patient details:', id);
  };
  
  // Moves a patient from the Triage Inbox to the Waiting Room
  const handleTriage = (id: string, esiLevel: number) => {
    setPatients(currentPatients => 
      currentPatients.map(p => 
        p.id === id 
          ? { ...p, esi: esiLevel, status: 'waiting', waitStartTs: simTime } 
          : p
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
        
        {/* Triage Inbox */}
        <View className="flex-1 min-h-[400px]">
          <TriageInbox 
            patients={patients.filter(p => p.status === 'triage')} 
            simTime={simTime} 
            onSelect={handleSelectPatient}
            onTriage={handleTriage}
          />
        </View>

        {/* Waiting Room */}
        <View className="flex-1 min-h-[300px]">
          <WaitingRoom 
            patients={patients.filter(p => p.status === 'waiting')} 
            simTime={simTime} 
            onSelect={handleSelectPatient} 
          />
        </View>

        {/* Temporary placeholders for the unbuilt components */}
        <View className="h-24 items-center justify-center border border-dashed border-slate-300 rounded-[20px] bg-slate-50 mb-8">
          <Text className="text-slate-400 font-medium">Treatment Bays (Pending)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}