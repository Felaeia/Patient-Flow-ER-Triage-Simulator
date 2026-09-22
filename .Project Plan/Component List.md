### 1. Global Layout & Structure
*   **App Shell / Layout Container:** The main grid wrapper that holds the header, main content, and sidebar.
*   **Top Navigation Bar (Header):** Contains logo, system status, time, controls, and global actions.
*   **Main Content Grid:** The 3-column layout (Left: Triage Inbox, Center: Workspace, Right: Sidebar).
*   **Footer:** Small disclaimer text at the very bottom.

### 2. Header Components
*   **Logo & Title Block:** Icon + "Patient Flow - ER Triage Simulator" text.
*   **System Status Badge:** "ED Command Center" with a green indicator.
*   **Live Clock:** Time display (e.g., "7:59:25 AM") + date.
*   **Icon Buttons:** Theme toggle (sun/moon), Notification bell, Help/Info icon.
*   **Simulation Controls:** Speed toggle (2x), "Add Patient" button, "Reset" button, "Pause" button.

### 3. KPI Metrics Row (Top Cards)
*   **KPI Card Component (x5):** Reusable card for "Patients in Dept", "Avg Door-to-Doctor", "Bed Occupancy", "Avg Wait Time", and "LWBS Risk".
*   **Metric Value Display:** Large numeric font.
*   **Status Indicator:** Small colored dot (green/gray) and subtext (e.g., "Target < 10 min", "0 Walk > 60 min").

### 4. Patient Flow Stepper (Workflow Bar)
*   **Stepper Container:** Horizontal bar tracking patient progress.
*   **Step Node:** Circle with count (Arrival, Triage, Waiting, Treatment, Disposition).
*   **Step Label:** Text below the node.
*   **Connector Lines:** Arrows or lines connecting the steps.
*   **Progress Indicator:** Visual representation of how many patients are at each stage.

### 5. Triage Inbox (Left Column)
*   **Panel Header:** Title, "3 New arrivals" badge, scroll indicator.
*   **Patient List:** Scrollable container holding patient cards.
*   **Patient Card (Complex Component):**
    *   *Header:* Patient ID (e.g., P-101), Acuity badge (ESI 1, ESI 3), Age/Gender, Triage badge, "Details" button.
    *   *Location Info:* Text (e.g., "Laceration").
    *   *Vitals Grid:* Icons and values for HR, BP, SpO2, Temp, Pain.
    *   *Wait Time:* Timer icon + duration (e.g., "Waiting 17s").
    *   *ESI Score Selector:* Row of 5 colored buttons (1 to 5) with labels below (Resuscitation, Emergent, Urgent, Less, Non-urgent).
    *   *Action Row:* 5 colored buttons for disposition/escalation.

### 6. Main Workspace (Center Column)
*   **Waiting Room Panel:**
    *   *Panel Header:* Title, "Priority Queue" badge, Sort dropdown ("Sorted by ESI, not FIFO").
    *   *Empty State Component:* Centered message ("No patients waiting. Triage inbox feeds here.").
*   **Treatment Bays Panel:**
    *   *Panel Header:* Title, Occupancy counter ("0/8 occupied"), Active/Free status toggle.
    *   *Bay Grid:* Responsive grid layout (2 columns x 4 rows).
    *   *Bay Card (Empty State):* Bay name (Bay 1-8), "FREE" badge, placeholder text ("Ready for ESI 1-2 priority assignment").
*   **Disposition Row:**
    *   *Discharged Card:* Header, count (0), icon.
    *   *Admitted Card:* Header, count (0), icon.

### 7. Staff & Resources (Right Sidebar - Top)
*   **Panel Header:** Title, "Off duty" filter/badge.
*   **Staff List:** Vertical list container.
*   **Staff Card:** Avatar/Initials, Name (e.g., Dr. Chen), Role (Doctor | idle), Status badge ("IDLE" / "BUSY").

### 8. Event Log (Right Sidebar - Middle)
*   **Panel Header:** Title, "Live" indicator (green dot).
*   **Log List:** Scrollable list of events.
*   **Log Item:** Timestamp (e.g., "7:59:25"), Log message text.
*   **Log Entry Types:** Information logs (ER command center online).

### 9. Simulation Info Card (Right Sidebar - Bottom)
*   **Info Panel Container:** Dark background card.
*   **Text Block:** "Why this simulation matters" heading + paragraph.
*   **ROI Signal Display:** Two metric boxes showing "95% door-to-doctor" and "LWBS early alert".

### 10. Reusable/Shared Components (Design System)
*   **Buttons:** Primary (blue), Secondary (outline), Action (colored), Icon buttons.
*   **Badges/Pills:** ESI badges, Triage badges, Status badges (IDLE, FREE, LIVE), Count badges.
*   **Cards:** Base card component with rounded corners, border, and padding.
*   **Icons:** Vector icons for vitals (heart, BP, lungs, thermometer), UI actions, and navigation.
*   **Scrollbars:** Custom styled scrollbars for the patient list and logs.
*   **Tooltips:** For hovering over vitals or icons (implied).