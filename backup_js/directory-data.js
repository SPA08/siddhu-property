// Legal Statuses
const LEGAL_STATUS = {
    APPROVED_VERIFIED: {
        id: "APPROVED_VERIFIED",
        label: "Approved status verified from cited source.",
        color: "teal"
    },
    GOVERNMENT_REFERENCE_ONLY: {
        id: "GOVERNMENT_REFERENCE_ONLY",
        label: "Government record exists; approval not confirmed.",
        color: "blue-grey"
    },
    MAP_VERIFIED: {
        id: "MAP_VERIFIED",
        label: "Locality/location confirmed on map; approval unknown.",
        color: "blue-grey"
    },
    LOCAL_CONFIRMED: {
        id: "LOCAL_CONFIRMED",
        label: "Known locally; official/map verification pending.",
        color: "amber"
    },
    UNAPPROVED_OFFICIAL: {
        id: "UNAPPROVED_OFFICIAL",
        label: "Authority currently reports scheme as unapproved/illegal.",
        color: "muted-red"
    },
    LOCATION_VERIFICATION_REQUIRED: {
        id: "LOCATION_VERIFICATION_REQUIRED",
        label: "Name known but exact map position not confirmed.",
        color: "amber"
    },
    STATUS_NOT_VERIFIED: {
        id: "STATUS_NOT_VERIFIED",
        label: "This locality is known locally or appears on maps, but its housing-scheme approval status has not yet been independently verified.",
        color: "amber"
    }
};

const KNOWN_COORDINATES = {
    "Hayat Abad": { lat: 30.5285, lng: 72.6840 },
    "Model Town": { lat: 30.5390, lng: 72.6950 },
    "Housing Colony": { lat: 30.5420, lng: 72.6880 },
    "Civil Line": { lat: 30.5370, lng: 72.6820 },
    "Green Town": { lat: 30.5460, lng: 72.7010 },
    "Hamza Block": { lat: 30.5310, lng: 72.6860 },
    "Iqbal Town": { lat: 30.5270, lng: 72.6930 },
    "Madina Colony": { lat: 30.5320, lng: 72.6770 },
    "Block 8": { lat: 30.5345, lng: 72.6905 },
    "Block 12": { lat: 30.5335, lng: 72.6895 },
    "Block 16": { lat: 30.5325, lng: 72.6885 },
    "Arazi Record Center Chichawatni": { lat: 30.5348, lng: 72.6865 },
    "Patwar Khana / Patwari Revenue Office": { lat: 30.5352, lng: 72.6870 },
    "Sub-Registrar / Registry Office": { lat: 30.5346, lng: 72.6860 },
    "PLRA Land Record Services": { lat: 30.5348, lng: 72.6865 },
    "Mutation / Intiqal Services": { lat: 30.5349, lng: 72.6864 },
    "Fard / Ownership Record Services": { lat: 30.5348, lng: 72.6866 },
    "DC Valuation / Property Valuation": { lat: 30.5350, lng: 72.6858 },
    "AC Office Chichawatni": { lat: 30.5350, lng: 72.6858 },
    "Municipal Committee Chichawatni": { lat: 30.5355, lng: 72.6895 },
    "Tehsil Council Chichawatni": { lat: 30.5349, lng: 72.6862 },
    "Excise, Taxation & Narcotics Control Chichawatni": { lat: 30.5351, lng: 72.6859 },
    "NADRA Registration Center Chichawatni": { lat: 30.5360, lng: 72.6880 },
    "Divisional Forest Office Chichawatni": { lat: 30.5410, lng: 72.6780 },
    "Judicial Complex Chichawatni": { lat: 30.5344, lng: 72.6855 },
    "Tehsil Courts Chichawatni": { lat: 30.5345, lng: 72.6856 },
    "Rescue 1122 Chichawatni": { lat: 30.5378, lng: 72.6935 },
    "Police Emergency 15": { lat: 30.5342, lng: 72.6910 },
    "City Police Station Chichawatni": { lat: 30.5342, lng: 72.6910 },
    "THQ Hospital Chichawatni": { lat: 30.5365, lng: 72.6920 },
    "Chichawatni Railway Station": { lat: 30.5338, lng: 72.6925 },
    "Siddhu Property Advisor": { lat: 30.5292, lng: 72.6845 },
    "Schollars Modal School": { lat: 30.5290, lng: 72.6835 },
    "The Laurels Campus": { lat: 30.5280, lng: 72.6842 },
    "Chichawatni College of Technology": { lat: 30.5275, lng: 72.6820 },
    "Masjid Quba": { lat: 30.5288, lng: 72.6848 }
};

const DIRECTORY_DATA = [];

// Helper to add
function addArea(name, parentChak, statusId, source, dateChecked, mapCoordinates = null) {
    let aliases = [name.toLowerCase()];
    if(name === "Hayat Abad") aliases.push("hayatabad");
    if(name === "Chichawatni City") aliases.push("chichawatni", "chicha watni");
    if(name === "Maqsood Town") aliases.push("mawsood town");

    const coords = mapCoordinates || KNOWN_COORDINATES[name] || null;
    const lat = coords ? coords.lat : null;
    const lng = coords ? coords.lng : null;

    DIRECTORY_DATA.push({
        id: name.toLowerCase().replace(/[\s\/,]+/g, "-") + "-" + (parentChak ? parentChak.toLowerCase().replace(/[\s\/,]+/g, "-") : "unknown"),
        name: name,
        aliases: aliases,
        type: "AREA",
        parentChak: parentChak,
        legalStatus: statusId,
        legalSourceUrl: source || null,
        lastVerified: dateChecked || new Date().toISOString().split("T")[0],
        mapCoordinates: coords,
        latitude: lat,
        longitude: lng,
        roads: [],
        streets: [],
        blocks: [],
        nearbyAreas: [],
        landmarks: []
    });
}

// 1. Core Chichawatni / 40/12-L
const chak40 = [
    "Ahmad Nagar", "Al Wahab Garden", "Barkat Town", "Cheema Town", "Christian Abadi", 
    "Civil Line", "Darvesh Pura", "Dastagir Park Block 1", "Dastagir Park Block 2", "Faisal Colony", 
    "Fareed Town", "Ghaffor Town", "Gulberg Town", "Gull Town", "Gulshan Fatima", "Hamza Block", 
    "Hassan Town", "Ali Town", "Hayat Abad", "Housing Colony", "Housing Colony 3 Marla Scheme", 
    "Islam Pura", "Bihar Colony", "Jinnah Block II", "Jinnah Town Phase I", "Maan Town", 
    "Madina Colony", "Marjan City", "Mehar Abad", "Model Town", "Model Town Bypass", "Nadar Town", 
    "Pearl/Peral Garden", "Raza Town", "Rehman City", "Royal City", "Shah Muhammad Town", 
    "Shahbaz Town", "Shahid Town", "Shamaspura", "Sikandar Town", "Tariq Town", "Umer Garden", 
    "Zaman Park", "Zaman Town"
];
chak40.forEach(a => addArea(a, "Chak 40/12-L", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// Blocks 8, 12, 16
addArea("Block 8", "Chichawatni City", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table");
addArea("Block 12", "Chichawatni City", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table");
addArea("Block 16", "Chichawatni City", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table");

// 2. 39/12-L cluster
const chak39 = [
    "Abu Baker Block", "Al Hafiz Garden", "Al Rehman Town", "Ayub Garden", "Azan City", 
    "Canal Fort Colony", "Chaudhery Model City", "Defence Block", "Garden Town", "Green Town", 
    "Gulshan Ali Town", "Gulshan Muazzam Colony", "Lalazar Housing Colony", "Mushtaq Town", 
    "Nazeer Town", "Rehman Garden", "Satellite Town", "Zam Zam Town", "Zikriya Town"
];
chak39.forEach(a => addArea(a, "Chak 39/12-L", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// 3. 109/12-L / bypass-side cluster
const chak109 = [
    "Abdullah Town", "Al Fateh Town", "Al Noor City", "Al Shafi Garden", "Ashraf Town", "Babu Town", 
    "Bagh Town", "Bilal Town", "Gulistan Colony", "Hameed Town", "Ideal Canal View", "Jinnah Town Phase III", 
    "Maqsood Town", "Nawab Town", "Oudh Colony", "Saddique Town", "Usman City"
];
chak109.forEach(a => addArea(a, "Chak 109/12-L", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// 4. 110/12-L
const chak110 = [
    "Abid City", "Al Jannat Town", "Al Madina Town", "Al Makkah Town", "Al Noor City Housing Scheme", 
    "Rai Ahmed Nawaz Town", "Rai Iqbal Town", "Rana Town"
];
chak110.forEach(a => addArea(a, "Chak 110/12-L", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// 5. 111/7-R
const chak111 = [
    "Al Hafiz Town", "Bagh Town Phase II", "Bagh Town Phase III", "Basti Ghulam Abad", "Bismillah Town", 
    "Green Land Housing Scheme", "Gulshan Ahmad Town", "Model Town"
];
chak111.forEach(a => addArea(a, "Chak 111/7-R", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// 6. Other important Chichawatni clusters
const otherChaks = [
    { chak: "Chak 113/12-L", areas: ["Abdullah Town", "Ali Town", "Zahid Block", "Zahid Town"] },
    { chak: "Chak 118/12-L", areas: ["Allah Dad Phase I", "Allah Dad Phase II", "Bhatta Colony", "Daras Colony", "Hammad City", "Manzoor Gardens", "Pak Vildars", "Royal Valley", "Siddique Garden", "Sikandar Town", "Sir Syed Town", "Zameer Colony"] },
    { chak: "Chak 21/11-L", areas: ["Ahmad Town", "Bismillah Town", "Faisal Town", "Gulshan Rehman Housing Scheme", "Iqbal Town", "Rehman City", "Usman Town"] },
    { chak: "Chak 22/11-L", areas: ["Kareem Garden", "Makkah Garden", "Rehman Town", "Haqdar Colony", "Sadar Colony"] }
];
otherChaks.forEach(c => {
    c.areas.forEach(a => addArea(a, c.chak, "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));
});

// 7. Other named Chichawatni schemes/localities in FBR
const otherFbrSchemes = [
    "Al Miraj Garden", "Saadi Town", "Siddique Garden Colony", "Al Haidar Garden", "Al Harram Garden", 
    "City Garden", "Canal View City", "Ahmad Behria Town", "Farid Town", "Madina Block", "Shalimar Garden", 
    "Heider Town", "Ghousia Colony", "Grace City / Imran Munir Colony", "Irshad Town", "Suleman Block", 
    "Umar Farooq City", "Colony Lajpal Sakhi"
];
otherFbrSchemes.forEach(a => addArea(a, "Chichawatni", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// 8. Additional Chichawatni-area settlements from FBR
const periCitySettlements = [
    "Glaciar Town", "Madina Town", "Raza Town", "Afzal Town", "Anwar Town", "Baho City", "Khurshid Town", 
    "Majid Town", "Mashkoor Town", "Muhammad Din Town", "Nisar Town", "Naeem Town", "Mustafa Block"
];
periCitySettlements.forEach(a => addArea(a, "Chichawatni Peri-City", "GOVERNMENT_REFERENCE_ONLY", "FBR Valuation Table"));

// 9. Local/map/address names
const localNames = [
    "Amirabad", "Forest Colony", "Marzipura", "Meherabad", "Nazir Town", "Shah Colony", "Shakir Colony", 
    "Shams Pura", "Bilal Ganj", "Mohalla Lakar Mandi", "Old Chichawatni", "Wali Town", "Abdullah Town I", 
    "Abdullah Town II", "Chichawatni City Housing Scheme", "Ghafoor Town", "Lalazar Town", 
    "Block 2", "Block 3", "Block 4", "Block 5", "Block 6", "Block 7", "Block 9", "Block 10", "Block 11", 
    "Block 13", "Block 14", "Block 15"
];
localNames.forEach(a => addArea(a, "Chichawatni", "LOCAL_CONFIRMED", "Web / Courier / Address Datasets"));

// 10. Tumhari local additions
addArea("Awan Town", "Chak 40/12-L", "LOCAL_CONFIRMED", "PULSE property-transfer rollout reporting 2025");
addArea("Saddiq Block", "Unknown", "LOCAL_CONFIRMED", "Local Knowledge");

// Unapproved Official List (April 2026 District Administration)
const rawUnapproved = [
    { name: "Abdullah Block", chak: "Chak 3/14-L" },
    { name: "Ashraf Block", chak: "Chak 109/12-L" },
    { name: "Bilal Garden", chak: "Chak 109/12-L" },
    { name: "Dream Land", chak: "Chak 111/7-R" },
    { name: "Hadi Town", chak: "Chak 109/12-L" },
    { name: "Iris City", chak: "Adda Khoiwala" },
    { name: "Subhani Garden", chak: "Chak 7/14-L" },
    { name: "Lasani Town", chak: "Chak 8/14-L, Kassowal" },
    { name: "Rehman Town", chak: "Chak 1A/14-L, Kassowal" },
    { name: "Shahid Town", chak: "Chak 40/12-L" }, // Exists in FBR
    { name: "Zahid Block", chak: "Chak 113/12-L" },
    { name: "Manzoor Garden", chak: "Chak 118/12-L, Kassowal" },
    { name: "Ahad Block", chak: "Chak 108/7-R" }
];

rawUnapproved.forEach(a => {
    let existing = DIRECTORY_DATA.find(d => d.name === a.name && d.parentChak === a.chak);
    if(existing) {
        existing.legalStatus = "UNAPPROVED_OFFICIAL";
        existing.legalSourceUrl = "District Administration List";
        existing.lastVerified = "2026-04-01";
    } else {
        addArea(a.name, a.chak, "UNAPPROVED_OFFICIAL", "District Administration List", "2026-04-01");
    }
});

// Approvals Update
let modelTown = DIRECTORY_DATA.find(d => d.name === "Model Town" && d.parentChak === "Chak 40/12-L");
if(modelTown) {
    modelTown.legalStatus = "APPROVED_VERIFIED";
    modelTown.legalSourceUrl = "DPDC approval NOC No. TO(P&C)/CCI/101";
}

// Map Verified updates
let royalCity = DIRECTORY_DATA.find(d => d.name === "Royal City" && d.parentChak === "Chak 40/12-L");
if(royalCity) {
    royalCity.legalStatus = "MAP_VERIFIED";
    royalCity.legalSourceUrl = "Public Map / Directory";
}

// --- Additional Helpers for Offices ---
function addOffice(name, type, aliasesList, address, phone, officeHours, services, mapCoordinates = null) {
    let aliases = [name.toLowerCase(), ...aliasesList.map(a => a.toLowerCase())];
    const coords = mapCoordinates || KNOWN_COORDINATES[name] || null;
    const lat = coords ? coords.lat : null;
    const lng = coords ? coords.lng : null;

    DIRECTORY_DATA.push({
        id: name.toLowerCase().replace(/[\s\/,]+/g, "-"),
        name: name,
        aliases: aliases,
        type: type, // "PROPERTY_RECORD", "GOVERNMENT_OFFICE", "PUBLIC_SERVICE"
        parentChak: "Chichawatni",
        legalStatus: "APPROVED_VERIFIED",
        legalSourceUrl: "Government Directory",
        lastVerified: new Date().toISOString().split("T")[0],
        mapCoordinates: coords,
        latitude: lat,
        longitude: lng,
        address: address || null,
        phone: phone || null,
        officeHours: officeHours || null,
        services: services || null
    });
}

// --- Property & Land Records ---
addOffice("Arazi Record Center Chichawatni", "PROPERTY_RECORD", ["plra", "land record", "fard", "arazi"], null, null, null, "Land record issuance, Fard, Mutation");
addOffice("Patwar Khana / Patwari Revenue Office", "PROPERTY_RECORD", ["patwari", "revenue", "fard", "intiqal"], null, null, null, "Local land records, ownership verification");
addOffice("Sub-Registrar / Registry Office", "PROPERTY_RECORD", ["registry", "registrar", "inteqal"], null, null, null, "Property registration, sales deeds");
addOffice("PLRA Land Record Services", "PROPERTY_RECORD", ["plra", "punjab land records"], null, null, null, "Online land record systems");
addOffice("Mutation / Intiqal Services", "PROPERTY_RECORD", ["mutation", "intiqal"], null, null, null, "Property transfer recording");
addOffice("Fard / Ownership Record Services", "PROPERTY_RECORD", ["fard", "ownership"], null, null, null, "Issuance of ownership proofs");
addOffice("DC Valuation / Property Valuation", "PROPERTY_RECORD", ["dc rate", "fbr rate", "valuation"], null, null, null, "Official property rates assessment");
addOffice("Revenue Office / Tehsil Revenue Services", "PROPERTY_RECORD", ["revenue", "tehsil revenue"], null, null, null, "General revenue and land matters");

// --- Government Offices ---
addOffice("AC Office Chichawatni", "GOVERNMENT_OFFICE", ["assistant commissioner", "ac office"], "Tehsil Complex", null, null, "Administrative, land, revenue matters");
addOffice("Municipal Committee Chichawatni", "GOVERNMENT_OFFICE", ["mc", "municipal", "baldia"], null, null, null, "Local government, city services, NOCs");
addOffice("Tehsil Council Chichawatni", "GOVERNMENT_OFFICE", ["tehsil council", "local govt"], null, null, null, "Rural development, local governance");
addOffice("Excise, Taxation & Narcotics Control Chichawatni", "GOVERNMENT_OFFICE", ["excise", "tax", "property tax"], null, null, null, "Property tax assessment, vehicle registration");
addOffice("NADRA Registration Center Chichawatni", "GOVERNMENT_OFFICE", ["nadra", "id card", "cnic"], null, null, null, "CNIC issuance, family registration");
addOffice("Divisional Forest Office Chichawatni", "GOVERNMENT_OFFICE", ["forest", "changa manga"], "Forest Colony", null, null, "Forestry management, plantation");
addOffice("Agriculture Office Chichawatni", "GOVERNMENT_OFFICE", ["agriculture", "zaraat"], null, null, null, "Farming guidance, subsidies");
addOffice("Livestock Office Chichawatni", "GOVERNMENT_OFFICE", ["livestock", "veterinary"], null, null, null, "Animal health, veterinary services");
addOffice("Suthra Punjab Tehsil Office Chichawatni", "GOVERNMENT_OFFICE", ["suthra punjab", "sanitation"], null, null, null, "City sanitation and cleanliness");
addOffice("MEPCO Office / Complex Chichawatni", "GOVERNMENT_OFFICE", ["mepco", "wapda", "electricity"], null, null, null, "Electricity billing, new connections");
addOffice("Sui Gas Office Chichawatni", "GOVERNMENT_OFFICE", ["sngpl", "sui gas", "gas"], null, null, null, "Gas billing, new connections");
addOffice("Judicial Complex Chichawatni", "GOVERNMENT_OFFICE", ["courts", "judicial", "sessions court"], null, null, null, "Civil and criminal courts");
addOffice("Tehsil Courts Chichawatni", "GOVERNMENT_OFFICE", ["tehsil court", "civil court"], null, null, null, "Local judicial hearings");
addOffice("Post Office Chichawatni", "GOVERNMENT_OFFICE", ["gpo", "post", "mail"], null, null, null, "Postal and financial services");

// --- Emergency / Public Services ---
addOffice("Rescue 1122 Chichawatni", "PUBLIC_SERVICE", ["1122", "rescue", "ambulance", "fire"], null, "1122", "24/7", "Emergency medical, fire, rescue");
addOffice("Police Emergency 15", "PUBLIC_SERVICE", ["15", "police emergency"], null, "15", "24/7", "Emergency police response");
addOffice("City Police Station Chichawatni", "PUBLIC_SERVICE", ["city thana", "police station"], null, null, "24/7", "City law enforcement");
addOffice("Sadar Police Station Chichawatni", "PUBLIC_SERVICE", ["sadar thana", "police station"], null, null, "24/7", "Rural/outskirts law enforcement");
addOffice("DSP Office Chichawatni", "PUBLIC_SERVICE", ["dsp", "police admin"], null, null, null, "Police administration");
addOffice("Traffic Police Chichawatni", "PUBLIC_SERVICE", ["traffic", "warden"], null, null, null, "Traffic management, licensing info");
addOffice("Punjab Highway Patrol", "PUBLIC_SERVICE", ["php", "highway police"], null, null, "24/7", "Highway safety and patrolling");
addOffice("THQ Hospital Chichawatni", "PUBLIC_SERVICE", ["thq", "hospital", "emergency"], null, null, "24/7 Emergency", "Public healthcare, emergency ward");
addOffice("Fire / Emergency Services", "PUBLIC_SERVICE", ["fire brigade"], null, null, "24/7", "Fire control");
addOffice("Chichawatni Railway Station", "PUBLIC_SERVICE", ["railway", "train", "station"], null, null, null, "Passenger rail services");
addOffice("Bus Stand / Public Transport Points", "PUBLIC_SERVICE", ["bus stand", "lorry adda", "transport"], null, null, null, "Intercity bus operations");

// --- NEW DATA INTEGRATION ---
// 1. Hayat Abad Streets
const hayatAbadStreets = [
    "Street No. 2", "Street No. 7", "Street No. 8 / Tower Road side", "Street No. 15"
];
hayatAbadStreets.forEach(s => {
    DIRECTORY_DATA.push({
        id: s.toLowerCase().replace(/[\s\/,]+/g, "-") + "-hayat-abad",
        name: s,
        aliases: [s.toLowerCase()],
        type: "STREET",
        parentChak: "Hayat Abad",
        legalStatus: "LOCAL_CONFIRMED",
        legalSourceUrl: "Owner Dataset",
        lastVerified: new Date().toISOString().split("T")[0],
        mapCoordinates: null
    });
});

// Add streets to Hayat Abad area if it exists
let hayatAbad = DIRECTORY_DATA.find(d => d.name === "Hayat Abad");
if (hayatAbad) {
    hayatAbad.streets = [...(hayatAbad.streets || []), ...hayatAbadStreets];
}

// 2. Property References
const propertyReferences = [
    { name: "Double Storey House (7 Marla)", address: "Street No. 15", desc: "7 beds, 4 baths", type: "PROPERTY_REFERENCE" },
    { name: "Double Storey House (10 Marla)", address: "Street No. 7", desc: "4 beds, 3 baths", type: "PROPERTY_REFERENCE" }
];
propertyReferences.forEach(p => {
    DIRECTORY_DATA.push({
        id: p.name.toLowerCase().replace(/[\s\(\),]+/g, "-") + "-hayat-abad",
        name: p.name,
        aliases: [],
        type: p.type,
        parentChak: "Hayat Abad",
        address: p.address,
        services: p.desc,
        legalStatus: "LOCAL_CONFIRMED"
    });
});

// Helper for Businesses
function addLocalBusiness(name, types, address, phone, plusCode, mapCoordinates = null) {
    let existing = DIRECTORY_DATA.find(d => d.name.toLowerCase() === name.toLowerCase());
    let primaryType = Array.isArray(types) ? types[0] : types;
    let typeArray = Array.isArray(types) ? types : [types];
    const coords = mapCoordinates || KNOWN_COORDINATES[name] || null;
    const lat = coords ? coords.lat : null;
    const lng = coords ? coords.lng : null;

    if (existing) {
        if (!existing.phone && phone) existing.phone = phone;
        if (!existing.address && address) existing.address = address;
        if (!existing.plusCode && plusCode) existing.plusCode = plusCode;
        if (!existing.mapCoordinates && coords) existing.mapCoordinates = coords;
        if (!existing.latitude && lat) existing.latitude = lat;
        if (!existing.longitude && lng) existing.longitude = lng;
        if (!existing.types) existing.types = [existing.type];
        typeArray.forEach(t => {
            if (!existing.types.includes(t)) existing.types.push(t);
        });
        existing.importStatus = "MERGED_EXISTING";
        return;
    }
    
    DIRECTORY_DATA.push({
        id: name.toLowerCase().replace(/[\s\/,&]+/g, "-"),
        name: name,
        aliases: [name.toLowerCase()],
        type: primaryType,
        types: typeArray, // Support multiple types
        parentChak: "Chichawatni",
        address: address || null,
        phone: phone || null,
        plusCode: plusCode || null,
        legalStatus: "LOCAL_CONFIRMED",
        importStatus: "NEW",
        sourceDataset: "Merged Data 2026",
        mapCoordinates: coords,
        latitude: lat,
        longitude: lng
    });
}

// 3. Real Estate / Property Dealers
const propertyDealers = [
    "Ahmad Property Dealers", "Rana Ahmad Property Dealer", "Decent Real Estate & Builder's",
    "AR Developers", "Chichawatni Property Links", "Ali Property Management", "Chohan Property Advisers",
    "Arshad Property Dealer", "Topline Real Estate", "Fahad Property Advisor & Builders",
    "Azan Property & Auto Dealers", "Siddhu Property Advisor", "Tariq Mehmood Property Dealer",
    "Maan Developers", "Punjab Property Adviser", "Lalazar / Pak Arab Developers", "Al-Haram Properties",
    "Model Town Housing Society Chichawatni", "Hassan Malik Liaqat Real Estate", "Property Network",
    "SAAD Rent A Car & Property Advisor", "Ravi Property Advisor", "Al Fajar Motors & Property Advisor",
    "Al Hamra Property Advisor", "Lasani Property Dealer", "Rana Aqib Biqa Anar Property Advisor",
    "Royal Estate Developer & Property Advisors"
];
propertyDealers.forEach(d => addLocalBusiness(d, ["PROPERTY_DEALER", "REAL_ESTATE_AGENCY"]));

// 4. Builders / Construction
const builders = [
    "Mugal House", "Ibn-e-Zaheer Associate & Construction", "Arslan Rafique", "Chaudary Brothers",
    "CHAUHDARY CONSTRUCTION COMPANY", "Lasani Marble Chichawatni", "Roofa Bhai", "Suleman Ansari",
    "Zulfiqar House", "AB Traders & Construction", "Urban Builders", "Chaudhary Zeeshan Maan",
    "Ansari Mansion", "Bao Rizwan Welding Shop", "SAJID Electric & Sanitory Store", "Bahadur",
    "Lalazar / Pak Arab Developers", "Al-Haram Properties"
];
builders.forEach(b => addLocalBusiness(b, ["HOUSE_BUILDER", "CONSTRUCTION_COMPANY"]));

// Adjust specific builders types
let lasaniMarble = DIRECTORY_DATA.find(d => d.name === "Lasani Marble Chichawatni");
if (lasaniMarble) { lasaniMarble.type = "BUILDING_MATERIAL"; lasaniMarble.types = ["BUILDING_MATERIAL", "CONSTRUCTION_COMPANY"]; }
let baoRizwan = DIRECTORY_DATA.find(d => d.name === "Bao Rizwan Welding Shop");
if (baoRizwan) { baoRizwan.type = "CONSTRUCTION_COMPANY"; baoRizwan.types = ["CONSTRUCTION_COMPANY"]; }
let sajidElectric = DIRECTORY_DATA.find(d => d.name === "SAJID Electric & Sanitory Store");
if (sajidElectric) { sajidElectric.type = "BUILDING_MATERIAL"; sajidElectric.types = ["BUILDING_MATERIAL", "CONSTRUCTION_COMPANY"]; }

// 5. Education
addLocalBusiness("Schollars Modal School", "SCHOOL", "Hayat Abad");
addLocalBusiness("Scholars Model Girls High School", "SCHOOL", "Hayat Abad");
addLocalBusiness("The Laurels Campus", "SCHOOL", "Street No. 2, Hayat Abad");
addLocalBusiness("Chichawatni College of Technology", ["SCHOOL", "LANDMARK"], "Burewala Road / Street No. 4, opposite Hayat Abad");

// 6. Mosques
addLocalBusiness("Masjid Quba", "MOSQUE", "Hayat Abad");
addLocalBusiness("Masjid Ayesha Sadika Ahlehadees", "MOSQUE", "Hayat Abad");

// 7. Local Businesses
addLocalBusiness("Hayat Electronic Chichawatni", "LOCAL_BUSINESS", "Hayat Abad");
addLocalBusiness("Hussain Traders", "LOCAL_BUSINESS", "Hayat Abad");

// 8. Verified Residential Homes Listings
const verifiedPropertyListings = [
    {
        id: "prop-12-marla-brand-new",
        name: "12 Marla Brand New Residence",
        aliases: ["12 marla", "brand new house", "tower road", "hayat abad house"],
        type: "PROPERTY",
        parentChak: "Chak 40/12-L",
        address: "Near Tower Road, Hayat Abad, Chichawatni",
        services: "3 Master Bedrooms • 4 Baths • Double Garage • Open Terrace",
        legalStatus: "APPROVED_VERIFIED",
        mapCoordinates: { lat: 30.5305, lng: 72.6852 },
        latitude: 30.5305,
        longitude: 72.6852
    },
    {
        id: "prop-10-marla-corner-house",
        name: "10 Marla Brand New Corner House",
        aliases: ["10 marla", "corner house", "model town house"],
        type: "PROPERTY",
        parentChak: "Model Town",
        address: "Model Town Phase I, Chichawatni",
        services: "5 Bedrooms • Wide SUV Garage • Lawn Space • Double TV Lounge",
        legalStatus: "APPROVED_VERIFIED",
        mapCoordinates: { lat: 30.5395, lng: 72.6958 },
        latitude: 30.5395,
        longitude: 72.6958
    },
    {
        id: "prop-5-marla-contemporary-home",
        name: "5 Marla Contemporary Residence",
        aliases: ["5 marla", "contemporary house", "hayat abad residence"],
        type: "PROPERTY",
        parentChak: "Hayat Abad",
        address: "Street 08 Tower Road, Hayat Abad, Chichawatni",
        services: "3 Bedrooms • Contemporary Tile Finish • Full Utilities Connected",
        legalStatus: "APPROVED_VERIFIED",
        mapCoordinates: { lat: 30.5288, lng: 72.6842 },
        latitude: 30.5288,
        longitude: 72.6842
    }
];
verifiedPropertyListings.forEach(p => DIRECTORY_DATA.push(p));

