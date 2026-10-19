import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HeartPulse,
  Clock,
  Info,
  Play,
  Pause,
  RotateCcw,
  Plus,
  LogIn,
  ClipboardList,
  Users,
  BedDouble,
  Building2,
  TriangleAlert,
  LogOut,
  Zap,
} from "lucide-react-native";

// Import your built components
import { TriageInbox } from "../components/TriageInbox";
import { WaitingRoom } from "../components/WaitingRoom";
import { TreatmentBays } from "../components/TreatmentBays";
import { StaffResources } from "../components/StaffResources";
import { EventLog } from "../components/EventLog";
import { PatientModal } from "../components/PatientModal";
import StatCard from "../components/common/StatCard";
import PipelineStep from "../components/common/PipelineStep";

export interface Patient {
  id: string;
  age: number;
  sex: string;
  complaint: string;
  vitals: {
    hr: number;
    bpSys: number;
    bpDia: number;
    spo2: number;
    temp: number;
  };
  pain: number;
  esi: number | null;
  suggestedEsi: number;
  status: "triage" | "waiting" | "treatment" | "discharged" | "admitted";
  arrivalTs: number;
  triageStartTs: number;
  waitStartTs: number | null;
  bedId: number | null;
  treatmentProgress: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: string;
  assignedPatientId: string | null; // <-- Explicitly allow string or null
}

// --- Main Dashboard ---
export default function PatientFlowDashboard() {
  const [simTime, setSimTime] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P-101",
      age: 24,
      sex: "F",
      complaint: "Abdominal Pain",
      vitals: { hr: 88, bpSys: 120, bpDia: 80, spo2: 98, temp: 37.1 },
      pain: 6,
      esi: null,
      suggestedEsi: 5,
      status: "triage",
      arrivalTs: 0,
      triageStartTs: 0,
      waitStartTs: null,
      bedId: null,
      treatmentProgress: 0,
    },
    {
      id: "P-102",
      age: 46,
      sex: "F",
      complaint: "Shortness of Breath",
      vitals: { hr: 110, bpSys: 145, bpDia: 90, spo2: 91, temp: 36.8 },
      pain: 4,
      esi: null,
      suggestedEsi: 2,
      status: "triage",
      arrivalTs: 0,
      triageStartTs: 0,
      waitStartTs: null,
      bedId: null,
      treatmentProgress: 0,
    },
    {
      id: "P-103",
      age: 27,
      sex: "M",
      complaint: "Overdose",
      vitals: { hr: 45, bpSys: 85, bpDia: 50, spo2: 88, temp: 36.2 },
      pain: 0,
      esi: null,
      suggestedEsi: 1,
      status: "triage",
      arrivalTs: 0,
      triageStartTs: 0,
      waitStartTs: null,
      bedId: null,
      treatmentProgress: 0,
    },
    {
      id: "P-104",
      age: 72,
      sex: "F",
      complaint: "Overdose",
      vitals: { hr: 55, bpSys: 95, bpDia: 60, spo2: 90, temp: 36.5 },
      pain: 0,
      esi: null,
      suggestedEsi: 2,
      status: "triage",
      arrivalTs: 0,
      triageStartTs: 0,
      waitStartTs: null,
      bedId: null,
      treatmentProgress: 0,
    },
  ]);

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "s1",
      name: "Dr. Chen",
      role: "Doctor",
      status: "Idle",
      assignedPatientId: null,
    },
    {
      id: "s2",
      name: "Dr. Alvarez",
      role: "Doctor",
      status: "Idle",
      assignedPatientId: null,
    },
    {
      id: "s3",
      name: "R. Patel RN",
      role: "Nurse",
      status: "Idle",
      assignedPatientId: null,
    },
    {
      id: "s4",
      name: "J. Kim RN",
      role: "Nurse",
      status: "Idle",
      assignedPatientId: null,
    },
    {
      id: "s5",
      name: "M. Okafor RN",
      role: "Nurse",
      status: "Idle",
      assignedPatientId: null,
    },
    {
      id: "s6",
      name: "S. Rivera RN",
      role: "Triage",
      status: "Idle",
      assignedPatientId: null,
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: "e1",
      ts: 24,
      type: "info",
      text: "P-105 arrived - Stroke Symptoms, 79F",
    },
    { id: "e2", ts: 18, type: "info", text: "P-104 arrived - Overdose, 72F" },
    {
      id: "e3",
      ts: 0,
      type: "success",
      text: "Shift started - ER command center online",
    },
  ]);

  // --- Simulation State Refs ---
  // Refs allow the simulation loop to read the absolute latest state without closure issues
  const patientsRef = useRef(patients);
  const staffRef = useRef(staff);
  const eventsRef = useRef(events);

  // Keep refs in sync with React state (e.g., when you manually trigger handleTriage)
  useEffect(() => {
    patientsRef.current = patients;
  }, [patients]);
  useEffect(() => {
    staffRef.current = staff;
  }, [staff]);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  // --- Main Simulation Loop ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSimTime((prevTime) => {
        const newTime = prevTime + 1;
        runSimulationTick(newTime);
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runSimulationTick = (currentTime: number) => {
    let currentPatients = [...patientsRef.current];
    let currentStaff = [...staffRef.current];
    let currentEvents = [...eventsRef.current];
    let stateChanged = false;

    const addEvent = (type: string, text: string) => {
      currentEvents = [
        { id: `e-${Date.now()}-${Math.random()}`, ts: currentTime, type, text },
        ...currentEvents,
      ].slice(0, 50); // Keep last 50 events
      stateChanged = true;
    };

    // 1. RANDOM ARRIVALS: Spawn a new patient every 15 seconds (30% chance)
    if (currentTime % 15 === 0 && Math.random() > 0.3) {
      const newId = `P-${100 + currentPatients.length + 1}`;
      const complaints = [
        "Chest Pain",
        "Fever",
        "Laceration",
        "Headache",
        "Stroke Symptoms",
      ];

      const newPatient: Patient = {
        id: newId,
        age: Math.floor(Math.random() * 60) + 20,
        sex: Math.random() > 0.5 ? "M" : "F",
        complaint: complaints[Math.floor(Math.random() * complaints.length)],
        vitals: { hr: 80, bpSys: 120, bpDia: 80, spo2: 98, temp: 37 },
        pain: Math.floor(Math.random() * 10),
        esi: null,
        suggestedEsi: Math.floor(Math.random() * 5) + 1,
        status: "triage",
        arrivalTs: currentTime,
        triageStartTs: currentTime,
        waitStartTs: null,
        bedId: null,
        treatmentProgress: 0,
      };

      currentPatients.push(newPatient);
      addEvent(
        "info",
        `New arrival: ${newPatient.id} - ${newPatient.complaint}`,
      );
      stateChanged = true;
    }

    // 2. TREATMENT PROGRESSION & DISPOSITION
    currentPatients.forEach((p, index) => {
      if (p.status === "treatment") {
        // High severity (ESI 1) takes longer to treat than low severity (ESI 5)
        const treatmentSpeed = p.esi ? p.esi * 1.5 : 5;
        const newProgress = p.treatmentProgress + treatmentSpeed;

        if (newProgress >= 100) {
          // Finish treatment and assign disposition
          const disposition = Math.random() > 0.7 ? "admitted" : "discharged";
          currentPatients[index] = {
            ...p,
            status: disposition,
            treatmentProgress: 100,
          };

          // Free up the bed and assigned staff
          currentStaff = currentStaff.map((s) =>
            s.assignedPatientId === p.id
              ? { ...s, status: "Idle", assignedPatientId: null }
              : s,
          );

          addEvent(
            "success",
            `${p.id} treatment complete. Patient ${disposition}.`,
          );
          stateChanged = true;
        } else {
          currentPatients[index] = { ...p, treatmentProgress: newProgress };
          stateChanged = true;
        }
      }
    });

    // 3. BED & STAFF ASSIGNMENT (Move from Waiting to Treatment)
    // Find empty beds
    const occupiedBeds = currentPatients
      .filter((p) => p.status === "treatment")
      .map((p) => p.bedId);
    const availableBeds = [1, 2, 3, 4, 5, 6, 7, 8].filter(
      (b) => !occupiedBeds.includes(b),
    );

    // Find idle staff
    const availableDocs = currentStaff.filter(
      (s) => s.role === "Doctor" && s.status === "Idle",
    );
    const availableNurses = currentStaff.filter(
      (s) => s.role === "Nurse" && s.status === "Idle",
    );

    // Queue: Sort by ESI severity first (1 is highest), then by wait time
    const waitingPatients = currentPatients
      .filter((p) => p.status === "waiting")
      .sort((a, b) => {
        if (a.esi !== b.esi) return (a.esi || 5) - (b.esi || 5);
        return (a.waitStartTs || 0) - (b.waitStartTs || 0);
      });

    // Assign patients if resources are available
    for (const wp of waitingPatients) {
      if (
        availableBeds.length > 0 &&
        availableDocs.length > 0 &&
        availableNurses.length > 0
      ) {
        const bedId = availableBeds.shift()!;
        const doc = availableDocs.shift()!;
        const nurse = availableNurses.shift()!;

        // Update Patient
        const pIndex = currentPatients.findIndex((p) => p.id === wp.id);
        currentPatients[pIndex] = { ...wp, status: "treatment", bedId };

        // Update Staff
        const dIndex = currentStaff.findIndex((s) => s.id === doc.id);
        const nIndex = currentStaff.findIndex((s) => s.id === nurse.id);
        currentStaff[dIndex] = {
          ...doc,
          status: "Busy",
          assignedPatientId: wp.id,
        };
        currentStaff[nIndex] = {
          ...nurse,
          status: "Busy",
          assignedPatientId: wp.id,
        };

        addEvent("info", `${wp.id} moved to Bed ${bedId} (ESI ${wp.esi})`);
        stateChanged = true;
      }
    }

    // Commit changes to React State
    if (stateChanged) {
      setPatients(currentPatients);
      setStaff(currentStaff);
      setEvents(currentEvents);
    }
  };

  const handleSelectPatient = (id: string) => setSelectedPatientId(id);

  const handleTriage = (id: string, esiLevel: number) => {
    setPatients((current) =>
      current.map((p) =>
        p.id === id
          ? { ...p, esi: esiLevel, status: "waiting", waitStartTs: simTime }
          : p,
      ),
    );
    setEvents((prev) => [
      {
        id: `e-${Date.now()}`,
        ts: simTime,
        type: "info",
        text: `${id} triaged as ESI ${esiLevel}.`,
      },
      ...prev,
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7f9]">
      {/* --- Top Navbar --- */}
      <View className="h-14 bg-white border-b border-slate-200 px-4 flex flex-row items-center justify-between z-10 shrink-0">
        <View className="flex flex-row items-center gap-3">
          <View className="h-8 w-8 rounded-lg bg-slate-900 items-center justify-center">
            <HeartPulse size={18} color="white" />
          </View>
          <View>
            <Text className="text-[14px] font-bold text-slate-900">
              Patient Flow - ER Triage Simulator{" "}
              <Text className="bg-slate-100 text-slate-600 px-1.5 rounded-md text-[10px] ml-2">
                POC
              </Text>
            </Text>
            <Text className="text-[11px] text-slate-500">
              ED Command Center •{" "}
              <View className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1" />{" "}
              Live triage
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-center gap-4">
          <View className="flex flex-row items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock size={14} color="#64748b" />
            <Text className="text-[12px] font-mono font-medium text-slate-700">
              18:24:33 | Sim T+{simTime}s
            </Text>
            <View className="h-2 w-2 rounded-full bg-emerald-500 ml-1 animate-pulse" />
          </View>

          <TouchableOpacity className="h-8 w-8 rounded-full border border-slate-200 items-center justify-center">
            <Info size={16} color="#64748b" />
          </TouchableOpacity>

          <View className="flex flex-row items-center bg-slate-100 p-0.5 rounded-full">
            <TouchableOpacity className="px-3 py-1 bg-white rounded-full shadow-sm">
              <Text className="text-[11px] font-bold">1x</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-3 py-1">
              <Text className="text-[11px] font-medium text-slate-500">2x</Text>
            </TouchableOpacity>
          </View>

          <View className="w-[1px] h-6 bg-slate-200" />

          <TouchableOpacity className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full">
            <Plus size={14} color="#0f172a" />
            <Text className="text-[12px] font-semibold text-slate-900">
              Add Patient
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full">
            <RotateCcw size={14} color="#64748b" />
            <Text className="text-[12px] font-semibold text-slate-700">
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row items-center gap-1.5 px-4 py-1.5 bg-slate-900 rounded-full">
            <Pause size={14} color="white" />
            <Text className="text-[12px] font-semibold text-white">Pause</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 
        Replaced the root ScrollView with a strict flex View. 
        This locks the dashboard to 100% height. 
      */}
      <View className="flex-1 p-4 gap-4 overflow-hidden">
        {/* --- Stats Row --- */}
        <View className="flex flex-row w-full gap-4 shrink-0">
          <StatCard
            title="PATIENTS IN DEPT"
            value="5"
            sub="0 waiting • 0 in bays"
            icon={Users}
          />
          <StatCard
            title="AVG DOOR-TO-DOCTOR"
            value="0s"
            sub="Target < 10 min IRL"
            icon={Clock}
            success
          />
          <StatCard
            title="BED OCCUPANCY"
            value="0%"
            sub="0/8 bays occupied"
            icon={BedDouble}
            success
          />
          <StatCard
            title="AVG WAIT TIME"
            value="0s"
            sub="Sorted by ESI priority"
            icon={Clock}
          />
          <StatCard
            title="LWBS RISK"
            value="0"
            sub="Wait >60s sim"
            icon={TriangleAlert}
          />
        </View>

        {/* --- Pipeline Tracker Row --- */}
        <View className="bg-white rounded-[20px] border border-slate-200 p-4 shadow-sm flex flex-row items-center justify-between shrink-0">
          <View className="flex-1 flex flex-row items-center">
            <PipelineStep icon={LogIn} label="ARRIVAL" count="5" />
            <PipelineStep icon={ClipboardList} label="TRIAGE" count="5" />
            <PipelineStep icon={Users} label="WAITING" count="0" />
            <PipelineStep icon={BedDouble} label="TREATMENT" count="0" />
            <PipelineStep
              icon={Building2}
              label="DISPOSITION"
              count="0"
              isLast
            />
          </View>
          <View className="pl-6 border-l border-slate-200 ml-4 hidden lg:flex">
            <Text className="text-[11px] text-slate-500 flex flex-row items-center">
              <Zap size={12} color="#94a3b8" /> Flow prioritizes ESI 1-2, not
              FIFO. Demonstrates triage value.
            </Text>
          </View>
        </View>

        {/* --- Main 3-Column Layout --- */}
        <View className="flex flex-row gap-4 flex-1 overflow-hidden">
          {/* Column 1: Triage (Left) - Flex 0.7 */}
          <View className="flex-[0.7]">
            <TriageInbox
              patients={patients.filter((p) => p.status === "triage")}
              simTime={simTime}
              onSelect={handleSelectPatient}
              onTriage={handleTriage}
            />
          </View>

          {/* Column 2: Waiting & Treatment (Center) - Flex 1.6 */}
          <View className="flex-[1.6] flex flex-col gap-4 overflow-hidden">
            <View className="flex-[0.8]">
              <WaitingRoom
                patients={patients.filter((p) => p.status === "waiting")}
                simTime={simTime}
                onSelect={handleSelectPatient}
              />
            </View>

            <View className="flex-[1.2] overflow-hidden">
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <TreatmentBays
                  beds={[1, 2, 3, 4, 5, 6, 7, 8]}
                  treatmentPatients={patients.filter(
                    (p) => p.status === "treatment",
                  )}
                  staff={staff}
                  onSelect={handleSelectPatient}
                />
              </ScrollView>
            </View>

            {/* Disposition Boxes */}
            <View className="h-[80px] shrink-0 flex flex-row gap-4">
              <View className="flex-1 rounded-[16px] bg-emerald-50 border border-emerald-200 p-4 flex flex-row justify-between items-end shadow-sm">
                <View>
                  <Text className="text-[11px] font-bold text-emerald-700 tracking-widest uppercase">
                    DISCHARGED
                  </Text>
                  <Text className="text-[28px] font-bold text-slate-900 leading-none mt-1">
                    0
                  </Text>
                </View>
                <LogOut size={24} color="#059669" />
              </View>
              <View className="flex-1 rounded-[16px] bg-amber-50 border border-amber-200 p-4 flex flex-row justify-between items-end shadow-sm">
                <View>
                  <Text className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">
                    ADMITTED
                  </Text>
                  <Text className="text-[28px] font-bold text-slate-900 leading-none mt-1">
                    0
                  </Text>
                </View>
                <Building2 size={24} color="#d97706" />
              </View>
            </View>
          </View>

          {/* Column 3: Staff, Logs & Info (Right) - Flex 0.7 */}
          <View className="flex-[0.7] flex flex-col gap-4">
            <View className="flex-[0.8] overflow-hidden">
              <StaffResources staff={staff} />
            </View>
            <View className="flex-[1.2] overflow-hidden">
              <EventLog events={events} />
            </View>
          </View>
        </View>
      </View>

      <PatientModal
        patient={patients.find((p) => p.id === selectedPatientId)}
        onClose={() => setSelectedPatientId(null)}
        onTriage={handleTriage}
      />
    </SafeAreaView>
  );
}
