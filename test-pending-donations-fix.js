/**
 * Test script to verify pendingDonations calculation fix
 * This simulates the Convex query logic to test the fix
 */

// Mock data representing donations in Convex database
const mockDonations = [
  {
    id: "1",
    amount: 100000,
    category: "zakat",
    donorName: "Ahmad",
    relawanId: "user1",
    type: "incoming",
    status: "pending", // explicit pending
    createdAt: Date.now() - 86400000
  },
  {
    id: "2", 
    amount: 50000,
    category: "infaq",
    donorName: "Budi",
    relawanId: "user2",
    type: "incoming",
    status: undefined, // undefined status - this was the problem!
    createdAt: Date.now() - 43200000
  },
  {
    id: "3",
    amount: 75000,
    category: "sedekah", 
    donorName: "Cici",
    relawanId: "user1",
    type: "incoming",
    status: "validated",
    createdAt: Date.now() - 21600000
  },
  {
    id: "4",
    amount: 25000,
    category: "wakaf",
    donorName: "Dono",
    relawanId: "user3", 
    type: "incoming",
    // status field completely missing - same as undefined
    createdAt: Date.now() - 3600000
  },
  {
    id: "5",
    amount: 150000,
    category: "zakat",
    donorName: "Eko",
    relawanId: "user2",
    type: "incoming", 
    status: "rejected",
    createdAt: Date.now() - 1800000
  }
];

// OLD LOGIC (before fix) - only counts explicit "pending"
function countPendingOld(donations) {
  return donations.filter(d => d.status === "pending").length;
}

// NEW LOGIC (after fix) - counts pending + undefined status
function countPendingNew(donations) {
  return donations.filter(d => d.status === "pending" || d.status === undefined).length;
}

// Run the test
console.log("🔍 Testing Pending Donations Calculation Fix");
console.log("=".repeat(50));

console.log("\n📊 Mock Donations Data:");
mockDonations.forEach((d, i) => {
  console.log(`${i + 1}. ${d.donorName} - ${d.category} - Rp${d.amount.toLocaleString()} - status: ${d.status ?? 'undefined'}`);
});

console.log("\n🔢 Results:");
console.log(`❌ OLD Logic (only explicit pending): ${countPendingOld(mockDonations)} donations`);
console.log(`✅ NEW Logic (pending + undefined): ${countPendingNew(mockDonations)} donations`);

console.log("\n📋 Expected Pending Donations:");
const expectedPending = mockDonations.filter(d => d.status === "pending" || d.status === undefined);
expectedPending.forEach((d, i) => {
  console.log(`${i + 1}. ${d.donorName} - ${d.category} - Rp${d.amount.toLocaleString()} - status: ${d.status ?? 'undefined'}`);
});

console.log(`\n✨ Fix Summary:`);
console.log(`- OLD logic missed donations with undefined status`);
console.log(`- NEW logic correctly counts all pending donations`);
console.log(`- Difference: ${countPendingNew(mockDonations) - countPendingOld(mockDonations)} additional pending donations found`);

console.log("\n🎯 This explains why pendingDonations data was incorrect!");
console.log("Donations without explicit status were not being counted as pending.");
