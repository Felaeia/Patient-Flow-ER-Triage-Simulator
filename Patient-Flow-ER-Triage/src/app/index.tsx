import React, { useState, useEffect } from 'react';
import { View, ScrollView,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import all your built components
import { TriageInbox } from '../components/TriageInbox';
import { WaitingRoom } from '../components/WaitingRoom';
import { TreatmentBays } from '../components/TreatmentBays';
import { StaffResources } from '../components/StaffResources';
import { EventLog } from '../components/EventLog';
import { PatientModal } from '../components/PatientModal';

// Mock data generator
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
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Seed state with mock patients
  const [patients, setPatients] = useState([
    generateMockPatient(1, 'triage'),
    generateMockPatient(2, 'triage'),
    generateMockPatient(3, 'waiting', 2),
    generateMockPatient(4, 'waiting', 4),
    generateMockPatient(5, 'treatment', 1, 1, 45), 
    generateMockPatient(6, 'treatment', 2, 3, 15), 
  ]);

  // Seed state with mock staff
  const [staff, setStaff] = useState([
    { id: 's1', name: 'Dr. Sarah', role: 'Doctor', status: 'Busy', assignedPatientId: 'P-105' },
    { id: 's2', name: 'Nurse John', role: 'Nurse', status: 'Busy', assignedPatientId: 'P-105' },
    { id: 's3', name: 'Nurse Amy', role: 'Nurse', status: 'Busy', assignedPatientId: 'P-106' },
    { id: 's4', name: 'Dr. Mike', role: 'Doctor', status: 'Idle', assignedPatientId: null },
  ]);

  // Seed state with mock events
  const [events, setEvents] = useState([
    { id: 'e1', ts: 12, type: 'info', text: 'P-101 arrived with Chest Pain.' },
    { id: 'e2', ts: 15, type: 'warn', text: 'Triage queue is growing. 2 patients waiting.' },
    { id: 'e3', ts: 24, type: 'success', text: 'P-105 admitted to Bay 1.' },
    { id: 'e4', ts: 45, type: 'critical', text: 'P-106 vitals dropping in Bay 3.' },
  ]);

  // Global timer
  useEffect(() => {
    const timer = setInterval(() => setSimTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
  };
  
  const handleTriage = (id: string, esiLevel: number) => {
    setPatients(currentPatients => 
      currentPatients.map(p => 
        p.id === id 
          ? { ...p, esi: esiLevel, status: 'waiting', waitStartTs: simTime } 
          : p
      )
    );
    // Add event log entry for triage
    setEvents(prev => [{ id: `e-${Date.now()}`, ts: simTime, type: 'info', text: `${id} triaged as ESI ${esiLevel}.` }, ...prev]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
      >
        
        {/* Top Row */}
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

        {/* Middle Row */}
        <View className="flex-1">
          <TreatmentBays 
            beds={[1, 2, 3, 4, 5, 6, 7, 8]} 
            treatmentPatients={patients.filter(p => p.status === 'treatment')} 
            staff={staff} 
            onSelect={handleSelectPatient} 
          />
        </View>

        {/* Bottom Row */}
        <View className="flex flex-col md:flex-row gap-4">
          <View className="flex-1 min-h-[250px]">
            <StaffResources staff={staff} />
          </View>
          <View className="flex-1 min-h-[250px]">
            <EventLog events={events} />
          </View>
        </View>

      </ScrollView>

      {/* Patient Details Modal */}
      <PatientModal 
        patient={patients.find(p => p.id === selectedPatientId)} 
        onClose={() => setSelectedPatientId(null)} 
        onTriage={handleTriage}
      />
    </SafeAreaView>
  );
}