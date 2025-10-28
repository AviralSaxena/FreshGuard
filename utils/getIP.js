import * as Network from "expo-network";

// Function to get the local IP address
const getLocalIp = async () => {
  try {
    const ip = await Network.getIpAddressAsync();
    console.log("Local IP Address:", ip);
    return ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

export default getLocalIp;
