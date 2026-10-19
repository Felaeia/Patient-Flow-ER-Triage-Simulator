import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';

// Import your built components
import { TriageInbox } from '../components/TriageInbox';
import { WaitingRoom } from '../components/WaitingRoom';
import { TreatmentBays } from '../components/TreatmentBays';

// Mock data generator for testing the UI
const generateMockPatient = (
  id: number, 
  status: 'triage' | 'waiting' | 'treatment', 
  esi?: number,
  bedId?: number,
  treatmentProgress?: number
) => ({
  id: `P-${100 + id}`,
  age: Math.floor(Math.random() * 60) + 20,
  sex: Math.random() > 0.5 ? 'M' : 'F',
  complaint: ['Chest Pain', 'Fever', 'Laceration', 'Shortness of Breath', 'Head Injury'][Math.floor(Math.random() * 5)],
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
  bedId: bedId || null,
  treatmentProgress: treatmentProgress || 0,
});

export default function PatientFlowDashboard() {
  const [simTime, setSimTime] = useState(0);
  
  // Seed state with mock patients across different statuses
  const [patients, setPatients] = useState([
    generateMockPatient(1, 'triage'),
    generateMockPatient(2, 'triage'),
    generateMockPatient(3, 'waiting', 2),
    generateMockPatient(4, 'waiting', 4),
    generateMockPatient(5, 'treatment', 1, 1, 45), // In Bay 1, 45% done
    generateMockPatient(6, 'treatment', 2, 3, 15), // In Bay 3, 15% done
  ]);

  // Seed state with mock staff
  const [staff, setStaff] = useState([
    { id: 's1', name: 'Dr. Sarah', role: 'Doctor', status: 'Busy', assignedPatientId: 'P-105' },
    { id: 's2', name: 'Nurse John', role: 'Nurse', status: 'Busy', assignedPatientId: 'P-105' },
    { id: 's3', name: 'Nurse Amy', role: 'Nurse', status: 'Busy', assignedPatientId: 'P-106' },
    { id: 's4', name: 'Dr. Mike', role: 'Doctor', status: 'Idle', assignedPatientId: null },
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
        
        {/* Top Row: Triage and Waiting Room */}
        <View className="flex flex-col md:flex-row gap-4">
          <View className="flex-1 min-h-[400px]">
            <TriageInbox 
              patients={patients.filter(p => p.status === 'triage')} 
              simTime={simTime} 
              onSelect={handleSelectPatient}
              onTriage={handleTriage}
            />
          </View>
          <View className="flex-1 min-h-[300px]">
            <WaitingRoom 
              patients={patients.filter(p => p.status === 'waiting')} 
              simTime={simTime} 
              onSelect={handleSelectPatient} 
            />
          </View>
        </View>

        {/* Middle Row: Treatment Bays */}
        <View className="flex-1">
          <TreatmentBays 
            beds={[1, 2, 3, 4, 5, 6, 7, 8]} // 8 standard bays 
            treatmentPatients={patients.filter(p => p.status === 'treatment')} 
            staff={staff} 
            onSelect={handleSelectPatient} 
          />
        </View>

        {/* Temporary placeholders for the remaining unbuilt components */}
        <View className="flex flex-row gap-4 mb-8">
          <View className="flex-1 h-24 items-center justify-center border border-dashed border-slate-300 rounded-[20px] bg-slate-50">
            <Text className="text-slate-400 font-medium">Staff & Resources (Pending)</Text>
          </View>
          <View className="flex-1 h-24 items-center justify-center border border-dashed border-slate-300 rounded-[20px] bg-slate-50">
            <Text className="text-slate-400 font-medium">Event Log (Pending)</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}