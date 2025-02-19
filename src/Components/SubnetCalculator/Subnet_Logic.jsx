export const validateIP = (ip) => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/; // Basic IPv4 regex validation
  if (!ipRegex.test(ip)) return false;

  const octets = ip.split('.').map(Number);
  return octets.every((octet) => octet >= 0 && octet <= 255);
};

export const calculateRequiredSubnetMask = (devices) => {
  if (devices < 1) return 32; // /32 for 1 device
  const totalHosts = parseInt(devices, 10) + 2; // Include network & broadcast
  const hostBits = Math.ceil(Math.log2(totalHosts)); // Required host bits
  return 32 - hostBits;
};

export const calculateNetworkAddress = (ip, mask) => {
  const ipBinary = ipToBinary(ip);
  const maskBinary = getSubnetMaskBinary(mask);
  const networkBinary = ipBinary.map((bit, i) => bit & maskBinary[i]);
  return binaryToIp(networkBinary);
};

export const calculateBroadcastAddress = (network, mask) => {
  const maskBinary = getSubnetMaskBinary(mask).map((bit) => (bit === 1 ? 0 : 1));
  const networkBinary = ipToBinary(network);
  const broadcastBinary = networkBinary.map((bit, i) => bit | maskBinary[i]);
  return binaryToIp(broadcastBinary);
};

export const calculateFirstUsableIp = (network, mask) => {
  if (mask === 32) return "N/A";  // No usable IPs for /32
  if (mask === 31) return network; // /31: first usable is the network itself
  const ipBinary = ipToBinary(network);
  const ipDecimal = binaryToDecimal(ipBinary);
  return decimalToIp(ipDecimal + 1);
};

export const calculateLastUsableIp = (broadcast, mask) => {
  if (mask === 32) return "N/A";  // No usable IPs for /32
  if (mask === 31) return broadcast; // /31: last usable is the broadcast itself
  const ipBinary = ipToBinary(broadcast);
  const ipDecimal = binaryToDecimal(ipBinary);
  return decimalToIp(ipDecimal - 1);
};

export const prefixToDecimal = (prefix) => {
  return Array(32)
    .fill(0)
    .fill(1, 0, prefix) // Fill '1's for the network bits
    .join('')
    .match(/.{8}/g) // Split into 8-bit octets
    .map((octet) => parseInt(octet, 2)) // Convert binary octets to decimal
    .join('.');
};

// Helper functions
const ipToBinary = (ip) =>
  ip
    .split('.')
    .map((octet) => Number(octet).toString(2).padStart(8, '0'))
    .join('')
    .split('')
    .map(Number);

const binaryToIp = (binary) =>
  binary
    .join('')
    .match(/.{8}/g)
    .map((octet) => parseInt(octet, 2))
    .join('.');

const binaryToDecimal = (binary) => parseInt(binary.join(''), 2);

const decimalToIp = (decimal) => {
  return [24, 16, 8, 0].map((shift) => (decimal >> shift) & 255).join('.');
};

const getSubnetMaskBinary = (mask) => Array(32).fill(0).fill(1, 0, mask);

export const getClassDefaultIP = (ipClass) => {
  switch (ipClass) {
    case 'A': return '10.0.0.0';
    case 'B': return '172.16.0.0';
    case 'C': return '192.168.0.0';
    default: return '0.0.0.0';
  }
};
